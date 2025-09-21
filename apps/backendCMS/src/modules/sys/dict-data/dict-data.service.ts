/*
 * @Author: ZhengJie
 * @Date: 2023-09-17 23:34:13
 * @Description: dictData.service
 */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateDictDatumDto } from './dto/create-dict-datum.dto';
import { UpdateDictDatumDto } from './dto/update-dict-datum.dto';
import { DelActionByIdsDot, GetPageDto } from './dto/index.dto';
import { ResultData } from 'src/utils/result';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { DictDatum } from './entities/dict-datum.entity';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { CommonQueryRepository, snowflakeID } from 'src/utils';
import { DictService } from '../dict/dict.service';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import {
  FormatDefaultPagination,
  FormatEmptyParams,
} from 'src/common/decorators/format-dto.decorator';
import * as moment from 'moment';

@Injectable()
export class DictDataService {
  private readonly queryRepository: CommonQueryRepository;

  constructor(
    @InjectRepository(DictDatum)
    private readonly dictDataRepository: Repository<DictDatum>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    @Inject(forwardRef(() => DictService))
    private readonly dictService: DictService,
  ) {
    this.queryRepository = new CommonQueryRepository(dictDataRepository);
  }

  /**
   * 新增
   */
  @CatchErrors()
  public async add(
    createDictDatumDto: CreateDictDatumDto,
    authorization: string,
  ) {
    // TODO: 未完成
    // 需要label、value同时唯一并且排除已删除状态的数据
    // const getFingLabel = await this.queryRepository.queryOne(
    //   {
    //     label: createDictDatumDto.dictLabel,
    //   },
    //   DictDatum,
    // );
    // const hasFindLabel = instanceToPlain(getFingLabel);
    // if (
    //   Object.keys(hasFindLabel).length > 0 &&
    //   instanceToPlain(hasFindLabel).deleted === 0
    // ) {
    //   return ResultData.fail(
    //     this.configService.get('errorCode.valid'),
    //     `已存在标签${createDictDatumDto.dictLabel}`,
    //   );
    // }
    // const getFindValue = await this.queryRepository.queryOne(
    //   {
    //     value: createDictDatumDto.dictValue,
    //   },
    //   DictDatum,
    // );
    // const hasFindValue = instanceToPlain(getFindValue);
    // if (
    //   Object.keys(hasFindValue).length > 0 &&
    //   instanceToPlain(hasFindValue).deleted === 0
    // ) {
    //   return ResultData.fail(
    //     this.configService.get('errorCode.valid'),
    //     `已存在键值${createDictDatumDto.dictValue}`,
    //   );
    // }

    // TODO: 未完成
    // // 查询是否存在dict-type
    // const getDictTypeResult = await this.dictService.findOne({
    //   type: createDictDatumDto.dictType,
    // });
    // if (Object.keys(instanceToPlain(getDictTypeResult)).length === 0) {
    //   return ResultData.fail(
    //     this.configService.get('errorCode.valid'),
    //     `不存在字典类型${createDictDatumDto.dictType}`,
    //   );
    // }
    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);
    if (
      createDictDatumDto.sort + '' === '' ||
      createDictDatumDto.sort === null ||
      createDictDatumDto.sort === undefined
    ) {
      const queryResult: [DictDatum[], number] =
        await this.queryRepository.queryCount(
          {
            where: {
              // status: In(['0', '2']),
              dictType: createDictDatumDto.dictType,
            },
          },
          DictDatum,
        );
      createDictDatumDto.sort = queryResult[1] + 1;
    }
    const newData: DictDatum = {
      ...createDictDatumDto,
      status: createDictDatumDto.status || '0',
      parentCode: '0',
      id: snowflakeID.NextId() + '',
      dictIcon: createDictDatumDto.dictIcon,
      corpCode: 'linshuiyunxi',
      corpName: '林水云夕',
      createBy: 'system',
      // createBy: JSON.parse(currentUser).username || 'system',
      createDate: new Date(),
      // updateBy: JSON.parse(currentUser).username || 'system',
      updateBy: 'system',
      updateDate: new Date(),
    };
    await this.dictDataRepository.save(newData);
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
    if (!ids) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查ids',
      );
    }
    if (ids.length === 0) {
      return ResultData.ok({}, '操作成功');
    }
    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);

    await this.dictDataRepository
      .createQueryBuilder()
      .update(DictDatum)
      .set({
        status: status || '1',
        updateDate: new Date(),
        updateBy: 'system',
      })
      .whereInIds(ids)
      .execute();
    return ResultData.ok({}, '操作成功');
  }

  /**
   * 删除
   */
  public async removeByDictType(dictType: string, authorization: string) {
    if (!dictType) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查dictType',
      );
    }
    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(`user_${auUserId}`);
    const result = await this.queryCount({
      where: { dictType: dictType },
    });
    const _removeList = instanceToPlain(result[0]).map((item: DictDatum) => {
      item = {
        ...item,
        updateDate: new Date(),
        updateBy: JSON.parse(currentUser).username,
      };
      return item;
    });
    await this.dictDataRepository.save(_removeList);
    return ResultData.ok(result, '操作成功');
  }

  /**
   * 更新
   */
  @CatchErrors()
  async update(updateDictDatumDto: UpdateDictDatumDto, authorization: string) {
    if (!updateDictDatumDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result = await this.queryRepository.queryOne(
      { id: updateDictDatumDto.id },
      DictDatum,
    );
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateDictDatumDto.id}，请检查id`,
      );
    }
    const resultPlain = instanceToPlain(result);
    if (resultPlain.status !== '0') {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `该条数据为非可用状态`,
      );
    }
    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);

    if (
      updateDictDatumDto.sort + '' === '' ||
      updateDictDatumDto.sort === null ||
      updateDictDatumDto.sort === undefined
    ) {
      const queryResult: [DictDatum[], number] =
        await this.queryRepository.queryCount(
          {
            where: {
              status: In(['0', '2']),
              dictType: updateDictDatumDto.dictType,
            },
          },
          DictDatum,
        );
      // TODO 按照id排序的最后一条数据的sort+1，如果没有，则不需要+1
      updateDictDatumDto.sort = queryResult[1];
    }
    const newData = {
      // ...instanceToPlain(result),
      ...updateDictDatumDto,
      updateDate: new Date(),
      updateBy: 'system',
    };
    await this.dictDataRepository.update(updateDictDatumDto.id, { ...newData });
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 分页
   */
  @CatchErrors()
  @FormatDefaultPagination()
  @FormatEmptyParams()
  public async getPage(dto: GetPageDto): Promise<ResultData> {
    const where = {
      status: In(dto.status ? [dto.status] : ['0', '2']),
      dictLabel: dto.dictLabel && Like(`%${dto.dictLabel}%`),
      dictValue: dto.dictValue && Like(`%${dto.dictValue}%`),
      isSys: dto.isSys,
      dictType: dto.dictType,
    };
    const result: [DictDatum[], number] = await this.queryRepository.queryCount(
      {
        where,
        order: { updateDate: 'DESC' },
        skip: (dto.pageNo - 1) * dto.pageSize,
        take: dto.pageSize,
      },
      DictDatum,
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
  async getList(): Promise<ResultData> {
    const result: [DictDatum[], number] = await this.queryRepository.queryCount(
      {
        where: { status: '0' },
      },
      DictDatum,
    );
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }

  @CatchErrors()
  async getListByType(type: string): Promise<ResultData> {
    if (!type) {
      return ResultData.ok([]);
    }
    const result: [DictDatum[], number] = await this.queryRepository.queryCount(
      {
        where: { status: In(['0', '2']), dictType: type },
      },
      DictDatum,
    );
    // return ResultData.ok({
    //   list: instanceToPlain(result[0]),
    //   total: result[1],
    // });
    return ResultData.ok(instanceToPlain(result[0]));
  }

  /**
   * 详情
   */
  public async getInfo(id: number): Promise<ResultData> {
    const result = await this.queryRepository.queryOne({ id: +id }, DictDatum);
    return ResultData.ok(result ? instanceToPlain(result) : {});
  }

  public async queryCount(options: any): Promise<[DictDatum[], number]> {
    const repositoryOptions: FindManyOptions<DictDatum> = {
      order: { updateDate: 'DESC' },
      ...options,
    };
    const result: [DictDatum[], number] =
      await this.dictDataRepository.findAndCount(repositoryOptions);
    const data: DictDatum[] = plainToInstance(DictDatum, result[0], {
      enableImplicitConversion: true,
    });
    return [data, result[1]];
  }
}
