/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: user.service
 */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { CacheService } from 'src/modules/cache/cache.service';
import { ResultData } from 'src/utils/result';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import {
  ActionByUserCodeDot,
  DelActionByIdsDot,
  GetPageDto,
} from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { CommonQueryRepository, snowflakeID } from 'src/utils';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import {
  FormatDefaultPagination,
  FormatEmptyParams,
} from 'src/common/decorators/format-dto.decorator';
import * as moment from 'moment';
import { ActionByIdDot } from 'src/common/dto/common.dto';

@Injectable()
export class UserService {
  private readonly queryRepository: CommonQueryRepository;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {
    this.queryRepository = new CommonQueryRepository(userRepository);
  }

  /**
   * 新增
   */
  @CatchErrors()
  public async create(
    createUserDto: CreateUserDto,
    authorization: string,
  ): Promise<ResultData> {
    const getOne = await this.queryRepository.queryOne(
      { userCode: createUserDto.userCode, status: In(['0', '2', '3']) },
      User,
    );
    if (getOne) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `用户编码${createUserDto.userCode}已存在`,
      );
    }

    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);

    const newData = {
      ...createUserDto,
      status: createUserDto.status || '0',
      id: snowflakeID.NextId() + '',
      createBy: 'system',
      // createBy: JSON.parse(currentUser).username || 'system',
      createDate: new Date(),
      // updateBy: JSON.parse(currentUser).username || 'system',
      updateBy: 'system',
      updateDate: new Date(),
      corpCode: 'linshuiyunxi',
      corpName: '林水云夕',
      // 手动格式化时间
      pwdUpdateDate: createUserDto.pwdUpdateDate
        ? new Date(createUserDto.pwdUpdateDate)
        : null,
      pwdQuestUpdateDate: createUserDto.pwdQuestUpdateDate
        ? new Date(createUserDto.pwdQuestUpdateDate)
        : null,
      lastLoginDate: createUserDto.lastLoginDate
        ? new Date(createUserDto.lastLoginDate)
        : null,
      freezeDate: createUserDto.freezeDate
        ? new Date(createUserDto.freezeDate)
        : null,
    };
    await this.userRepository.save(newData);
    return ResultData.ok(
      {
        ...newData,
        password: undefined,
        createDate: moment(newData.createDate).format('YYYY-MM-DD HH:mm:ss'),
        updateDate: moment(newData.updateDate).format('YYYY-MM-DD HH:mm:ss'),
      },
      '操作成功',
    );
  }

  /**
   * 微信登录自动创建用户
   */
  @CatchErrors()
  public async createByWx(
    createUserDto: CreateUserDto | any,
  ): Promise<ResultData> {
    const newData = {
      ...createUserDto,
    };
    await this.userRepository.save(newData);
    return ResultData.ok(
      {
        ...newData,
        password: undefined,
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
  public async remove(
    opt: DelActionByIdsDot,
    authorization: string,
  ): Promise<ResultData> {
    const { ids, status } = opt;
    if (!ids || ids.length === 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查ids',
      );
    }
    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        status: status || '1',
        updateDate: new Date(),
        // updateBy: JSON.parse(currentUser).username || 'system',
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
  public async update(updateUserDto: any, authorization: string) {
    if (!updateUserDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result: User = await this.queryRepository.queryOne(
      { id: updateUserDto.id },
      User,
    );
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateUserDto.id}，请检查id`,
      );
    }
    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);
    const newData = {
      ...updateUserDto,
      updateBy: 'system',
      // updateBy: JSON.parse(currentUser).username || 'system',
      updateDate: new Date(),
      // 手动格式化时间
      pwdUpdateDate: updateUserDto.pwdUpdateDate
        ? new Date(updateUserDto.pwdUpdateDate)
        : null,
      pwdQuestUpdateDate: updateUserDto.pwdQuestUpdateDate
        ? new Date(updateUserDto.pwdQuestUpdateDate)
        : null,
      lastLoginDate: updateUserDto.lastLoginDate
        ? new Date(updateUserDto.lastLoginDate)
        : null,
      freezeDate: updateUserDto.freezeDate
        ? new Date(updateUserDto.freezeDate)
        : null,
    };
    await this.userRepository.update({ id: updateUserDto.id }, { ...newData });
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
   * 重置密码
   */
  @CatchErrors()
  public async resetPassword(
    resetPasswordDto: ActionByIdDot,
    authorization: string,
  ): Promise<ResultData> {
    if (!resetPasswordDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result: User = await this.queryRepository.queryOne(
      { id: resetPasswordDto.id },
      User,
    );
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${resetPasswordDto.id}，请检查id`,
      );
    }
    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);

    await this.userRepository.update(
      { id: resetPasswordDto.id },
      {
        password: '1234567890',
        // updateBy: JSON.parse(currentUser).username || 'system',
        updateBy: 'system',
        updateDate: new Date(),
      },
    );
    return ResultData.ok({}, '操作成功');
  }

  /**
   * 分页
   */
  @CatchErrors()
  @FormatDefaultPagination()
  @FormatEmptyParams()
  public async getUserPage(
    dto: GetPageDto,
    excludePsd = true,
  ): Promise<ResultData> {
    const where = {
      status: In(dto.status ? [dto.status] : ['0', '2']),
      userCode: dto.userCode && Like(`%${dto.userCode}%`),
      loginCode: dto.loginCode && Like(`%${dto.loginCode}%`),
      userName: dto.userName && Like(`%${dto.userName}%`),
      email: dto.email && Like(`%${dto.email}%`),
      mobile: dto.mobile && Like(`%${dto.mobile}%`),
      phone: dto.phone && Like(`%${dto.phone}%`),
      sex: dto.sex || undefined,
      mgrType: dto.mgrType || undefined,
    };
    console.log('dto', dto);
    const result: [User[], number] = await this.queryRepository.queryCount(
      {
        where,
        order: { updateDate: 'DESC' },
        skip: (dto.pageNo - 1) * dto.pageSize,
        take: dto.pageSize,
      },
      User,
    );
    return ResultData.ok({
      list: instanceToPlain(result[0]).map((item: User) => {
        return {
          ...item,
          // 手动去除，以便其余地方直接调用
          password: excludePsd ? undefined : item.password,
        };
      }),
      total: result[1],
      pageNo: dto.pageNo,
      pageSize: dto.pageSize,
    });
  }

  /**
   * 查询用户列表
   */
  @CatchErrors()
  public async getUserList(excludePsd = true) {
    const result: [User[], number] = await this.queryRepository.queryCount(
      {
        where: { status: '0' },
      },
      User,
    );
    return ResultData.ok({
      list: instanceToPlain(result[0]).map((item: User) => {
        return {
          ...item,
          // 手动去除，以便其余地方直接调用
          password: excludePsd ? undefined : item.password,
        };
      }),
      total: result[1],
    });
  }

  /**
   * 查询信息
   */
  @CatchErrors()
  public async getInfo(
    opt: ActionByUserCodeDot,
    excludePsd = true,
  ): Promise<ResultData> {
    if (Object.keys(opt).length === 0) {
      return ResultData.ok({});
    }
    const result = await this.queryRepository.queryOne(
      {
        userCode: opt.userCode ? opt.userCode : undefined,
        id: opt.id ? opt.id : undefined,
        loginCode: opt.loginCode ? opt.loginCode : undefined,
        wxOpenid: opt.wxOpenid ? opt.wxOpenid : undefined,
      },
      User,
    );
    if (Object.keys(result).length === 0) {
      return ResultData.ok({});
    }
    return ResultData.ok(
      result
        ? {
            ...instanceToPlain(result),
            // 手动去除，以便其余地方直接调用
            password: excludePsd ? undefined : instanceToPlain(result).password,
          }
        : {},
    );
  }

  /**
   * 查询在线人数（TODO）
   */
  public async getOnlineUsers(): Promise<ResultData> {
    return ResultData.ok(1);
  }

  /**
   * 注册用户
   */
  // public async registerUser(createUserDto: CreateUserDto) {
  //   // 查询是否存在用户名
  //   const getUser = await this.findOne({ username: createUserDto.username });
  //   console.log('getUser', getUser);
  //   if (Object.keys(getUser).length > 0) {
  //     return ResultData.fail(400, `已存在用户：${createUserDto.username}`);
  //   }
  //   console.log('createUserDto', createUserDto);
  //   // // 手动拼数据
  //   // let newUserData = {

  //   // }

  //   return ResultData.ok(instanceToPlain(getUser));
  // }

  /**
   * 查询用户
   */
  private async queryCount(options: any): Promise<[User[], number]> {
    const repositoryOptions: FindManyOptions<User> = {
      order: { update_time: 'DESC' },
      ...options,
    };
    const result: [User[], number] = await this.userRepository.findAndCount(
      repositoryOptions,
    );
    const data: User[] = plainToInstance(User, result[0], {
      enableImplicitConversion: true,
    });
    return [data, result[1]];
  }

  /**
   * 查找一个
   */
  public async findOne(opt: any): Promise<User> {
    let user = await this.userRepository.findOne({ where: opt });
    user = plainToInstance(
      User,
      { ...user },
      { enableImplicitConversion: true },
    );
    return user;
  }

  // async create(createUserDto: CreateUserDto) {
  //   // // 开启事务
  //   // const queryRunner = this.dataSource.createQueryRunner()
  //   // await queryRunner.connect();
  //   // await queryRunner.startTransaction();
  //   // try {
  //   //   await queryRunner.manager.save
  //   // } catch (error) {
  //   // }
  //   return 'This action adds a new user';
  // }
}
