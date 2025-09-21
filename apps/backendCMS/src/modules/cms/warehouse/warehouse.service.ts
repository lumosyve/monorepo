import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonQueryRepository, snowflakeID } from 'src/utils';
import { Warehouse } from './entities/warehouse.entity';
import { In, Like, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../sys/auth/auth.service';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import { CacheService } from 'src/modules/cache/cache.service';
import { ResultData } from 'src/utils/result';
import * as moment from 'moment';
import { DelActionByIdsDot, GetPageDto } from './dto/index-warehouse.dto';
import { instanceToPlain } from 'class-transformer';
import {
  FormatDefaultPagination,
  FormatEmptyParams,
} from 'src/common/decorators/format-dto.decorator';

@Injectable()
export class WarehouseService {
  private readonly queryRepository: CommonQueryRepository;
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {
    this.queryRepository = new CommonQueryRepository(warehouseRepository);
  }

  /**
   * 增
   */
  @CatchErrors()
  public async create(
    createWarehouseDto: CreateWarehouseDto,
    authorization: string,
  ) {
    const getSameData: [Warehouse[], number] =
      await this.queryRepository.queryCount(
        {
          where: {
            warehouseName: createWarehouseDto.warehouseName,
            status: '0',
          },
        },
        Warehouse,
      );
    if (getSameData[1] > 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '该名称已存在',
      );
    }

    const { data: tokenData } = await this.authService.validToken(
      authorization,
    );
    const currentUser = await this.cacheService.get(
      `user_${tokenData.id}_${tokenData.userName}`,
    );

    const newData = {
      ...createWarehouseDto,
      status: createWarehouseDto.status || '0',
      id: snowflakeID.NextId() + '',
      createBy: JSON.parse(currentUser).userCode || 'system',
      createDate: new Date(),
      updateBy: JSON.parse(currentUser).userCode || 'system',
      updateDate: new Date(),
    };
    await this.warehouseRepository.save(newData);
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
    await this.warehouseRepository
      .createQueryBuilder()
      .update(Warehouse)
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
  public async update(
    updateWarehouseDto: UpdateWarehouseDto,
    authorization: string,
  ) {
    if (!updateWarehouseDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result: Warehouse = await this.queryRepository.queryOne(
      { id: updateWarehouseDto.id },
      Warehouse,
    );
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateWarehouseDto.id}，请检查id`,
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
      ...updateWarehouseDto,
      updateBy: JSON.parse(currentUser).userCode || 'system',
      updateDate: new Date(),
    };
    await this.warehouseRepository.update(
      { id: updateWarehouseDto.id },
      { ...newData },
    );
    return ResultData.ok(
      {
        ...newData,
        createDate: moment(result.createDate).format('YYYY-MM-DD HH:mm:ss'),
        updateDate: moment(newData.updateDate).format('YYYY-MM-DD HH:mm:ss'),
      },
      '操作成功',
    );
  }

  /**
   * 分页
   */
  @CatchErrors()
  @FormatDefaultPagination()
  @FormatEmptyParams()
  public async getPage(dto: GetPageDto): Promise<ResultData> {
    const where = {
      warehouseName: dto.warehouseName && Like(`%${dto.warehouseName}%`),
      status: In(dto.status ? [dto.status] : ['0', '2']),
    };
    const result: [Warehouse[], number] = await this.queryRepository.queryCount(
      {
        where,
        order: { updateDate: 'DESC' },
        skip: (dto.pageNo - 1) * dto.pageSize,
        take: dto.pageSize,
      },
      Warehouse,
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
    const result: [Warehouse[], number] = await this.queryRepository.queryCount(
      {
        // where: { status: '0', createBy: createBy || null },
        where: { status: '0' },
      },
      Warehouse,
    );
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }

  /**
   * 详情
   */
  @CatchErrors()
  public async getInfo(corpCode: string): Promise<ResultData> {
    if (!corpCode) {
      return ResultData.ok({});
    }
    const result = await this.queryRepository.queryOne(
      { corpCode: corpCode },
      Warehouse,
    );
    return ResultData.ok(result ? instanceToPlain(result) : {});
  }
}
