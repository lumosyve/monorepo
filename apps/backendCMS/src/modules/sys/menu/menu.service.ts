/*
 * @Author: ZhengJie
 * @Date: 2023-10-17 22:57:06
 * @Description: menu.service
 */
import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindManyOptions, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { GetPageDto } from './dto/index.dto';
import { ResultData } from 'src/utils/result';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { arrayToNestedTree, snowflakeID } from 'src/utils';

import MenuJson from '../auth/json/menu';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * 新增
   */
  public async create(
    createDto: CreateMenuDto,
    authorization: string,
  ): Promise<ResultData> {
    const result = await this.findOne({ name: createDto.name });
    if (
      Object.keys(instanceToPlain(result)).length > 0 &&
      instanceToPlain(result).deleted === '0'
    ) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `已存在${createDto.name}`,
      );
    }

    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(`user_${auUserId}`);
    const newData: Menu = {
      status: 0,
      ...createDto,
      id: snowflakeID.NextId() as number,
      deleted: 0,
      creator: JSON.parse(currentUser).username,
      hidden: 0,
      create_time: new Date(),
      update_time: new Date(),
      updater: JSON.parse(currentUser).username,
    };
    await this.menuRepository.save(newData);
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 删除
   */
  public async remove(id: number) {
    if (!id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    // 菜单自身删除
    let result = await this.findOne({ id: +id });
    result = instanceToPlain(result) as Menu;
    result.deleted = 1;
    result.deleted_time = new Date();
    // 菜单子集删除
    let resultChild = await this.menuRepository.find({
      where: { parentId: result.id },
    });
    resultChild = instanceToPlain(resultChild) as Menu[];
    resultChild = resultChild.map((item: Menu) => {
      item.deleted = 1;
      item.deleted_time = new Date();
      return item;
    });
    // 创建事物
    await this.entityManager.transaction(async (manager) => {
      await manager.save(Menu, result);
      await manager.save(Menu, resultChild);
    });
    return ResultData.ok({}, '操作成功');
  }

  /**
   * 更新
   */
  public async update(updateDto: UpdateMenuDto, authorization: string) {
    if (!updateDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result = await this.findOne({ id: +updateDto.id });
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateDto.id}，请检查id`,
      );
    }
    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(`user_${auUserId}`);
    const newData = {
      ...instanceToPlain(result),
      ...updateDto,
      id: +updateDto.id,
      update_time: new Date(),
      updater: JSON.parse(currentUser).username,
    };
    await this.menuRepository.save(newData);
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 分页
   */
  public async getPage(dto: GetPageDto): Promise<ResultData> {
    const params: GetPageDto = {
      ...dto,
      pageNo: dto.pageNo ? +dto.pageNo : 1,
      pageSize: dto.pageSize ? +dto.pageSize : 15,
    };
    const where = {
      deleted: +params.status === 2 ? 1 : 0,
      status: +params.status === 2 ? undefined : params.status,
      name: params.name,
      type: params.type,
    };
    const result: [Menu[], number] = await this.queryCount({
      where,
      order: { update_time: 'DESC' },
      skip: (params.pageNo - 1) * params.pageSize,
      take: params.pageSize,
    });
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
      pageNo: params.pageNo,
      pageSize: params.pageSize,
    });
  }

  /**
   * 列表
   */
  public async getList(): Promise<ResultData> {
    const result: [Menu[], number] = await this.queryCount({
      where: { status: 0, deleted: 0 },
    });
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }

  /**
   * 详情
   */
  public async getInfo(id: number): Promise<ResultData> {
    const result = await this.findOne({ id: +id });
    return ResultData.ok(result ? instanceToPlain(result) : {});
  }

  /**
   * 获取树状结构数据
   */
  public async getTree() {
    const where = {
      deleted: 0,
      status: 0,
    };
    const result: [Menu[], number] = await this.queryCount({
      where,
      order: { update_time: 'DESC' },
    });
    const resData = instanceToPlain(result[0]);
    const data = arrayToNestedTree(resData);
    return data;
    // try {
    //   console.log('data', data);
    //   return ResultData.ok(data);
    // } catch (error) {
    //   console.log('error', error);
    //   return ResultData.ok(resData);
    // }
  }

  /**
   * 初始化
   * @param authorization token
   */
  public async initMenuRoute(authorization: string) {
    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(`user_${auUserId}`);
    let result: Menu[] = [];
    let parent_id = 0;
    let sortNum = 0;

    const eachChild = (data) => {
      return data.map(async (item: Menu | any) => {
        sortNum++;
        const newItem: Menu = {
          id: snowflakeID.NextId() as number,
          parentId: parent_id,
          name: item.name,
          title: item.meta.title,
          type: item.type || 1,
          path: item.path,
          redirectPath: item.redirect,
          component: item.component,
          icon: item.meta.icon,
          code: item.code,
          hidden: +item.meta.hideMenu,
          status: 0,
          sort: sortNum,
          remark: undefined,
          creator: JSON.parse(currentUser).username,
          create_time: new Date(),
          updater: JSON.parse(currentUser).username,
          update_time: new Date(),
          deleted: undefined,
          deleted_time: undefined,
        };
        result.push(newItem);
        parent_id = newItem.id;
        if (item.children) {
          eachChild(item.children);
        }
      });
    };
    eachChild(MenuJson);
    try {
      await this.menuRepository.save(result);
      return ResultData.ok(result);
    } catch (error) {
      console.log('error', error);
    }
  }

  public async findOne(opt: any): Promise<Menu> {
    let result = await this.menuRepository.findOne({ where: opt });
    result = plainToInstance(
      Menu,
      { ...result },
      { enableImplicitConversion: true },
    );
    return result;
  }

  private async queryCount(options: any): Promise<[Menu[], number]> {
    const repositoryOptions: FindManyOptions<Menu> = {
      order: { update_time: 'DESC' },
      ...options,
    };
    const result: [Menu[], number] = await this.menuRepository.findAndCount(
      repositoryOptions,
    );
    const data: Menu[] = plainToInstance(Menu, result[0], {
      enableImplicitConversion: true,
    });
    return [data, result[1]];
  }
}
