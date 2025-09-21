/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 01:25:59
 * @LastEditTime: 2025-03-12 15:40:19
 * @Description: goods.service
 */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateGoodDto, GoodsToStore } from './dto/create-good.dto';
import { UpdateGoodDto, UpdateGoodStoreDto } from './dto/update-good.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonQueryRepository, snowflakeID } from 'src/utils';
import { Goods } from './entities/good.entity';
import { DataSource, In, Like, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../sys/auth/auth.service';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import { CacheService } from 'src/modules/cache/cache.service';
import { ResultData } from 'src/utils/result';
import * as moment from 'moment';
import {
  ActionByIdDot,
  DelActionByIdsDot,
  GetPageDto,
} from './dto/index-good.dto';
import { instanceToPlain } from 'class-transformer';
import {
  FormatDefaultPagination,
  FormatEmptyParams,
} from 'src/common/decorators/format-dto.decorator';
import { InventoryService } from '../inventory/inventory.service';
import { Inventory } from '../inventory/entities/inventory.entity';

@Injectable()
export class GoodsService {
  private readonly queryRepository: CommonQueryRepository;
  constructor(
    @InjectRepository(Goods)
    private readonly goodsRepository: Repository<Goods>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService: InventoryService,
    private dataSource: DataSource,
  ) {
    this.queryRepository = new CommonQueryRepository(goodsRepository);
  }

  /**
   * 增
   */
  @CatchErrors()
  public async create(createGoodDto: CreateGoodDto, authorization: string) {
    const getSameData: [Goods[], number] =
      await this.queryRepository.queryCount(
        {
          where: {
            goodsBarCode: createGoodDto.goodsBarCode,
            status: '0',
          },
        },
        Goods,
      );
    if (getSameData[1] > 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '该商品条码已存在',
      );
    }

    const { data: tokenData } = await this.authService.validToken(
      authorization,
    );
    const currentUser = await this.cacheService.get(
      `user_${tokenData.id}_${tokenData.userName}`,
    );

    const newData = {
      ...createGoodDto,
      status: createGoodDto.status || '0',
      id: snowflakeID.NextId() + '',
      createBy: JSON.parse(currentUser).userCode || 'system',
      createDate: new Date(),
      updateBy: JSON.parse(currentUser).userCode || 'system',
      updateDate: new Date(),
    };
    await this.goodsRepository.save(newData);
    return ResultData.ok(
      {
        ...newData,
        createDate: moment(newData.createDate).format('YYYY-MM-DD HH:mm:ss'),
        updateDate: moment(newData.updateDate).format('YYYY-MM-DD HH:mm:ss'),
      },
      '操作成功',
    );
  }

  /**
   * 入库
   */
  @CatchErrors()
  public async toStore(goodsToStore: GoodsToStore, authorization: string) {
    let goodsId = goodsToStore.goodsId;
    if (!goodsToStore.goodsId) {
      // 商品不存在，查条形码
      const getSameData: [Goods[], number] =
        await this.queryRepository.queryCount(
          {
            where: {
              goodsBarCode: goodsToStore.goodsBarCode,
              status: '0',
            },
          },
          Goods,
        );
      if (getSameData[1] === 0) {
        // 无条形码
        const { data: createResData } = await this.create(
          {
            ...goodsToStore,
          },
          authorization,
        );
        goodsId = createResData.id;
        // 同时创建一条库存记录
        await this.inventoryService.create({
          goodsId: goodsId,
          warehouseId: goodsToStore.warehouseId,
          inventoryNumber: 0,
        });
      } else {
        goodsId = instanceToPlain(getSameData[0])[0].id;
      }
    }
    // 修改库存数据
    const { data: inventoryResData } = await this.inventoryService.addNum(
      {
        goodsId: goodsId,
        warehouseId: goodsToStore.warehouseId,
        inventoryNumber: +goodsToStore.goodsNum,
      },
      authorization,
    );
    return ResultData.ok(
      {
        goodsId: goodsId,
        inventoryNumber: inventoryResData.inventoryNumber,
      },
      '操作成功',
    );
  }

  /**
   * 删除
   */
  @CatchErrors()
  public async remove(opt: DelActionByIdsDot, authorization: string) {
    const { ids, status } = opt;
    if (!ids || ids.length === 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查ids',
      );
    }
    const { data: tokenData } = await this.authService.validToken(
      authorization,
    );
    const currentUser = await this.cacheService.get(
      `user_${tokenData.id}_${tokenData.userName}`,
    );
    await this.goodsRepository
      .createQueryBuilder()
      .update(Goods)
      .set({
        status: status || '1',
        updateDate: new Date(),
        updateBy: JSON.parse(currentUser).userCode || 'system',
      })
      .whereInIds(ids)
      .execute();
    return ResultData.ok({}, '操作成功');
  }

  /**
   * 更新
   */
  @CatchErrors()
  public async update(updateGoodDto: UpdateGoodDto, authorization: string) {
    if (!updateGoodDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result: Goods = await this.queryRepository.queryOne(
      { id: updateGoodDto.id },
      Goods,
    );
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateGoodDto.id}，请检查id`,
      );
    }
    const resultPlain = instanceToPlain(result);
    if (resultPlain.status !== '0') {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `该条数据为非可用状态`,
      );
    }
    const { data: tokenData } = await this.authService.validToken(
      authorization,
    );
    const currentUser = await this.cacheService.get(
      `user_${tokenData.id}_${tokenData.userName}`,
    );
    const newData = {
      ...updateGoodDto,
      updateBy: JSON.parse(currentUser).userCode || 'system',
      updateDate: new Date(),
    };
    await this.goodsRepository.update({ id: updateGoodDto.id }, { ...newData });
    return ResultData.ok(
      {
        ...newData,
        createDate: moment(result.createDate).format('YYYY-MM-DD HH:mm:ss'),
        updateDate: moment(newData.updateDate).format('YYYY-MM-DD HH:mm:ss'),
      },
      '操作成功',
    );
  }

  @CatchErrors()
  public async updateToStore(
    updateGoodStoreDto: UpdateGoodStoreDto,
    authorization: string,
  ) {
    // 检查比填项
    if (isNaN(parseFloat(updateGoodStoreDto.inventory.inventoryNumber))) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查库存数量',
      );
    }
    if (!updateGoodStoreDto.goodsBarCode) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查条形码',
      );
    }
    if (!updateGoodStoreDto.goodsName) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查商品名称',
      );
    }

    const { data: tokenData } = await this.authService.validToken(
      authorization,
    );
    const currentUser = await this.cacheService.get(
      `user_${tokenData.id}_${tokenData.userName}`,
    );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // 开始事务
    try {
      // 更新Goods
      const newGoodsData = {
        ...updateGoodStoreDto,
        updateBy: JSON.parse(currentUser).userCode || 'system',
        updateDate: new Date(),
        inventory: undefined,
      };
      await queryRunner.manager.update(
        Goods,
        { id: updateGoodStoreDto.id },
        newGoodsData,
      );
      // 更新Inventory
      const newInventoryData = {
        ...updateGoodStoreDto.inventory,
        updateBy: JSON.parse(currentUser).userCode || 'system',
        updateDate: new Date(),
      };
      await queryRunner.manager.update(
        Inventory,
        {
          goodsId: newInventoryData.goodsId,
          warehouseId: newInventoryData.warehouseId,
        },
        newInventoryData,
      );
      await queryRunner.commitTransaction();
      return ResultData.ok({}, '操作成功');
    } catch (error) {
      // 失败回滚
      console.log('error', error);
      await queryRunner.rollbackTransaction();
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '操作失败',
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 分页
   */
  @CatchErrors()
  @FormatDefaultPagination()
  @FormatEmptyParams()
  public async getPage(dto: GetPageDto): Promise<ResultData> {
    const where = {
      goodsName: dto.goodsName && Like(`%${dto.goodsName}%`),
      status: In(dto.status ? [dto.status] : ['0', '2']),
    };
    const result: [Goods[], number] = await this.queryRepository.queryCount(
      {
        where,
        order: { updateDate: 'DESC' },
        skip: (dto.pageNo - 1) * dto.pageSize,
        take: dto.pageSize,
      },
      Goods,
    );
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
      pageNo: dto.pageNo,
      pageSize: dto.pageSize,
    });
  }

  /**
   * 列表
   */
  @CatchErrors()
  public async getList(authorization: string): Promise<ResultData> {
    let createBy = null;
    const { data: tokenData } = await this.authService.validToken(
      authorization,
    );
    const currentUser = await this.cacheService.get(
      `user_${tokenData.id}_${tokenData.userName}`,
    );
    if (JSON.parse(currentUser).mgrType === '0') {
      createBy = JSON.parse(currentUser).userCode;
    }
    const result: [Goods[], number] = await this.queryRepository.queryCount(
      {
        where: { status: '0' },
        // where: { status: '0', createBy: createBy || null },
      },
      Goods,
    );
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }
  @CatchErrors()
  public async getListByWarehouseId(
    query: {
      warehouseId?: string;
    },
    authorization: string,
  ): Promise<ResultData> {
    if (!query.warehouseId) {
      // 查全部商品
      return this.getList(authorization);
    }
    const queryBuilder = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.goods', 'goods');

    const result = await queryBuilder
      .where('inventory.warehouseId = :warehouseId', {
        warehouseId: query.warehouseId,
      })
      .getManyAndCount();

    return ResultData.ok({
      list: result[0],
      total: result[1],
    });
  }

  /**
   * 详情
   */
  @CatchErrors()
  public async getInfo(detailDto: ActionByIdDot): Promise<ResultData> {
    if (!detailDto.id && !detailDto.goodsBarCode) {
      return ResultData.ok({});
    }
    let result: any = {};
    const queryBuilder = this.goodsRepository
      .createQueryBuilder('goods')
      .leftJoinAndSelect('goods.inventory', 'inventory');
    if (detailDto.goodsBarCode) {
      result = await queryBuilder
        .where('goods.goodsBarCode = :goodsBarCode', {
          goodsBarCode: detailDto.goodsBarCode,
        })
        .getOne();
    } else if (detailDto.id) {
      result = await queryBuilder
        .where('goods.id = :id', {
          id: detailDto.id,
        })
        .getOne();
    }
    return ResultData.ok(result || {});
  }
}
