/*
 * @Author: ZhengJie
 * @Date: 2025-01-11 20:20:15
 * @LastEditTime: 2025-02-14 04:00:21
 * @Description: corp.service
 */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateCorpDto } from './dto/create-corp.dto';
import { UpdateCorpDto } from './dto/update-corp.dto';
import { DelActionByIdsDot, GetPageDto } from './dto/index-corp.dto';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import {
  FormatDefaultPagination,
  FormatEmptyParams,
} from 'src/common/decorators/format-dto.decorator';
import { ResultData } from 'src/utils/result';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { Corp } from './entities/corp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { CommonQueryRepository, snowflakeID } from 'src/utils';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CorpService {
  private readonly queryRepository: CommonQueryRepository;
  constructor(
    @InjectRepository(Corp)
    private readonly corpRepository: Repository<Corp>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    this.queryRepository = new CommonQueryRepository(corpRepository);
  }
  @CatchErrors()
  public async create(createCorpDto: CreateCorpDto, authorization: string) {
    // TODO 需要唯一并且排除已删除状态的数据
    // const auUserId = await this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);
    const newData = {
      ...createCorpDto,
      status: createCorpDto.status || '0',
      id: snowflakeID.NextId() + '',
      createBy: 'system',
      // createBy: JSON.parse(currentUser).username || 'system',
      createDate: new Date(),
      // updateBy: JSON.parse(currentUser).username || 'system',
      updateBy: 'system',
      updateDate: new Date(),
    };
    await this.corpRepository.save(newData);
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
    await this.corpRepository
      .createQueryBuilder()
      .update(Corp)
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
  public async update(updateCorpDto: UpdateCorpDto, authorization: string) {
    if (!updateCorpDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result: Corp = await this.queryRepository.queryOne(
      { id: updateCorpDto.id },
      Corp,
    );
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateCorpDto.id}，请检查id`,
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
    const newData = {
      ...updateCorpDto,
      updateBy: 'system',
      // updateBy: JSON.parse(currentUser).username || 'system',
      updateDate: new Date(),
    };
    await this.corpRepository.update({ id: updateCorpDto.id }, { ...newData });
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
      corpCode: dto.corpCode && Like(`%${dto.corpCode}%`),
      corpName: dto.corpName && Like(`%${dto.corpName}%`),
      status: In(dto.status ? [dto.status] : ['0', '2']),
    };
    const result: [Corp[], number] = await this.queryRepository.queryCount(
      {
        where,
        order: { updateDate: 'DESC' },
        skip: (dto.pageNo - 1) * dto.pageSize,
        take: dto.pageSize,
      },
      Corp,
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
    const result: [Corp[], number] = await this.queryRepository.queryCount(
      {
        where: { status: '0' },
      },
      Corp,
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
      Corp,
    );
    return ResultData.ok(result ? instanceToPlain(result) : {});
  }
}
