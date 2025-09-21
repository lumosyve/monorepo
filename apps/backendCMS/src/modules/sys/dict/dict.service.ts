/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 18:19:30
 * @Description: dict.service
 */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { DelActionByIdsDot, GetPageDto } from './dto/index.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dict } from './entities/dict.entity';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ResultData } from 'src/utils/result';
import { ConfigService } from '@nestjs/config';
import { CommonQueryRepository, snowflakeID } from 'src/utils';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { DictDataService } from '../dict-data/dict-data.service';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import {
  FormatDefaultPagination,
  FormatEmptyParams,
} from 'src/common/decorators/format-dto.decorator';
import * as moment from 'moment';

@Injectable()
export class DictService {
  private readonly queryRepository: CommonQueryRepository;

  constructor(
    @InjectRepository(Dict)
    private readonly dictRepository: Repository<Dict>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    @Inject(forwardRef(() => DictDataService))
    private readonly dictDataService: DictDataService,
  ) {
    this.queryRepository = new CommonQueryRepository(dictRepository);
  }

  /**
   * 新增
   */
  @CatchErrors()
  public async create(
    createDictDto: CreateDictDto,
    authorization: string,
  ): Promise<ResultData> {
    // // 需要name、type同时唯一并且排除已删除状态的数据
    // const getFingName = await this.queryRepository.queryOne(
    //   {
    //     name: createDictDto.name,
    //   },
    //   Dict,
    // );
    // const hasFindName = instanceToPlain(getFingName);
    // if (
    //   Object.keys(hasFindName).length > 0 &&
    //   +instanceToPlain(hasFindName).status === 1
    // ) {
    //   return ResultData.fail(
    //     this.configService.get('errorCode.valid'),
    //     `已存在名称${createDictDto.name}`,
    //   );
    // }
    // const getFindType = await this.queryRepository.queryOne(
    //   {
    //     type: createDictDto.type,
    //   },
    //   Dict,
    // );
    // const hasFindType = instanceToPlain(getFindType);
    // if (
    //   Object.keys(hasFindType).length > 0 &&
    //   +instanceToPlain(hasFindType).status === 1
    // ) {
    //   return ResultData.fail(
    //     this.configService.get('errorCode.valid'),
    //     `已存在类型${createDictDto.type}`,
    //   );
    // }
    // const auUserId = await this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);
    const newData = {
      ...createDictDto,
      status: createDictDto.status || '0',
      id: snowflakeID.NextId() + '',
      createBy: 'system',
      // createBy: JSON.parse(currentUser).username || 'system',
      createDate: new Date(),
      // updateBy: JSON.parse(currentUser).username || 'system',
      updateBy: 'system',
      updateDate: new Date(),
    };
    await this.dictRepository.save(newData);
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
    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);

    await this.dictRepository
      .createQueryBuilder()
      .update(Dict)
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
   * 更新
   */
  @CatchErrors()
  public async update(updateDictDto: UpdateDictDto, authorization: string) {
    if (!updateDictDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result = await this.queryRepository.queryOne(
      { id: updateDictDto.id },
      Dict,
    );
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateDictDto.id}，请检查id`,
      );
    }
    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);
    const newData = {
      ...updateDictDto,
      updateDate: new Date(),
      updateBy: 'system',
    };
    await this.dictRepository.update(updateDictDto.id, {
      ...newData,
    });
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
      dictName: dto.dictName && Like(`%${dto.dictName}%`),
      dictType: dto.dictType && Like(`%${dto.dictType}%`),
    };
    const result: [Dict[], number] = await this.queryRepository.queryCount(
      {
        where,
        order: { updateDate: 'DESC' },
        skip: (dto.pageNo - 1) * dto.pageSize,
        take: dto.pageSize,
      },
      Dict,
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
  public async getList(): Promise<ResultData> {
    const result: [Dict[], number] = await this.queryRepository.queryCount(
      {
        where: { status: In(['0', '2']) },
      },
      Dict,
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
  public async getInfo(id: string): Promise<ResultData> {
    const result = await this.queryRepository.queryOne({ id: +id }, Dict);
    return ResultData.ok(result ? instanceToPlain(result) : {});
  }
}
