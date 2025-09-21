/*
 * @Author: ZhengJie
 * @Date: 2023-10-18 23:12:58
 * @Description: role.service
 */
import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { ResultData } from 'src/utils/result';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CommonQueryRepository, snowflakeID } from 'src/utils';
import { DelActionByIdsDot, GetPageDto } from './dto/index.dto';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import * as moment from 'moment';
import {
  FormatDefaultPagination,
  FormatEmptyParams,
} from 'src/common/decorators/format-dto.decorator';

@Injectable()
export class RoleService {
  private readonly queryRepository: CommonQueryRepository;

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {
    this.queryRepository = new CommonQueryRepository(roleRepository);
  }

  /**
   * 新增
   */
  @CatchErrors()
  public async create(
    createRoleDto: CreateRoleDto,
    authorization: string,
  ): Promise<ResultData> {
    // TODO 需要唯一并且排除已删除状态的数据
    // const result = await this.queryRepository.queryOne(
    //   { roleCode: createRoleDto.roleCode },
    //   Role,
    // );
    // if (
    //   Object.keys(instanceToPlain(result)).length > 0 &&
    //   instanceToPlain(result).deleted === '0'
    // ) {
    //   return ResultData.fail(
    //     this.configService.get('errorCode.valid'),
    //     `已存在${createDto.name}`,
    //   );
    // }

    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);

    const newData = {
      ...createRoleDto,
      status: createRoleDto.status || '0',
      id: snowflakeID.NextId() + '',
      createBy: 'system',
      // createBy: JSON.parse(currentUser).username || 'system',
      createDate: new Date(),
      // updateBy: JSON.parse(currentUser).username || 'system',
      updateBy: 'system',
      updateDate: new Date(),
    };
    await this.roleRepository.save(newData);
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

    await this.roleRepository
      .createQueryBuilder()
      .update(Role)
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
  public async update(updateRoleDto: UpdateRoleDto, authorization: string) {
    if (!updateRoleDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result = await this.queryRepository.queryOne(
      { id: updateRoleDto.id },
      Role,
    );

    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateRoleDto.id}，请检查id`,
      );
    }

    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);
    const newData = {
      ...updateRoleDto,
      updateBy: 'system',
      // updateBy: JSON.parse(currentUser).username || 'system',
      updateDate: new Date(),
    };
    await this.roleRepository.update({ id: updateRoleDto.id }, { ...newData });
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
      roleCode: dto.roleCode && Like(`%${dto.roleCode}%`),
      roleName: dto.roleName && Like(`%${dto.roleName}%`),
      isSys: dto.isSys && Like(`%${dto.isSys}%`),
      userType: dto.userType && Like(`%${dto.userType}%`),
      status: In(dto.status ? [dto.status] : ['0', '2']),
    };
    const result: [Role[], number] = await this.queryRepository.queryCount(
      {
        where,
        order: { updateDate: 'DESC' },
        skip: (dto.pageNo - 1) * dto.pageSize,
        take: dto.pageSize,
      },
      Role,
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
    const result: [Role[], number] = await this.queryRepository.queryCount(
      {
        where: { status: '0' },
      },
      Role,
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
    if (!id) {
      return ResultData.ok({});
    }
    const result = await this.queryRepository.queryOne({ id: id }, Role);
    return ResultData.ok(result ? instanceToPlain(result) : {});
  }
}
