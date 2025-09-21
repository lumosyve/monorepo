/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 00:37:45
 * @Description: utils
 */

import * as moment from 'moment';
import SnowflakeID from './snowflake';
import { FindManyOptions, Repository, ValueTransformer } from 'typeorm';
import { plainToInstance } from 'class-transformer';

export const getControllerName = (__dirname) => {
  return __dirname.split('/modules')[1];
};

/**
 * 时间格式化
 * @param value 时间
 * @param fmt 格式
 * @param emptyString 空值
 * @returns string
 */
export const formatDate = (
  value: any,
  fmt = 'YYYY-MM-DD HH:mm:ss',
  emptyString = '-',
) => {
  if (!value || value === '-') {
    return emptyString || '';
  }
  return moment(value).format(fmt);
  // return value;
};

export const dateTransformer: ValueTransformer = {
  to: (value: Date) => value,
  from: (value: Date) => value && moment(value).format('YYYY-MM-DD HH:mm:ss'),
};

/**
 * 输出log
 * @param args any
 */
export const log2term = (...args: any) => {
  console.log(formatDate(moment()), args);
};

const options: any = {
  WorkerId: process.pid,
};
export const snowflakeID = new SnowflakeID(options);

export function arrayToNestedTree(items) {
  const result = {}; // 存储节点 id 和节点对象的映射关系
  const rootNodes = []; // 存储根节点

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const node = {
      id: item.id,
      parentId: item.parentId,
      name: item.name,
      path: item.path,
      url: item.path,
      redirect: item.redirect,
      target: '',
      meta: {
        color: '',
        hideMenu: Boolean(item.hidden),
        icon: item.icon,
        title: item.title,
      },
      // data: item.data,
      children: [],
    };

    result[item.id] = node; // 添加到节点映射关系中

    if (item.parentId === null || item.parentId === 0) {
      // 如果该节点是根节点
      rootNodes.push(node);
    } else {
      // 如果该节点不是根节点，递归查找其父节点，并将它添加到父节点的 children 数组中
      const parentNode = result[item.parentId];
      if (parentNode) {
        parentNode.children.push(node);
      } else {
        // 如果父节点还不存在于映射关系中，递归查找其父节点的父节点，直到找到根节点，并将当前节点添加到根节点的 children 数组中
        const parentNodeChain = getParentChain(result, item.parentId);
        parentNodeChain.push(node);
      }
    }
  }

  return rootNodes; // 返回根节点数组
}

function getParentChain(result, parentId) {
  const parentNodeChain = [];
  while (parentId !== null) {
    const parentNode = result[parentId];
    parentNodeChain.unshift(parentNode);
    parentId = parentNode.parentId;
  }
  return parentNodeChain;
}

/**
 * 提取 modules 之后的路径
 * @param path 路径
 * @returns String
 */
export function extractPathAfterModules(path) {
  const modulesIndex = path.indexOf('modules');
  if (modulesIndex !== -1) {
    return path.substring(modulesIndex);
  }
  return '找不到路径';
}

/**
 * 通用查询数据库
 */
export class CommonQueryRepository {
  constructor(private readonly repository: Repository<any>) {}

  /**
   * 查询和总数
   * @param options 查询条件
   * @param targetClass 对应的Entity
   * @returns 【查询结果，总数】
   */
  public async queryCount<T>(
    options: any,
    targetClass: new (...args: any[]) => T,
  ): Promise<[T[], number]> {
    const repositoryOptions: FindManyOptions<any> = {
      order: { updateDate: 'DESC' },
      ...options,
    };
    const result: [T[], number] = await this.repository.findAndCount(
      repositoryOptions,
    );
    const data: T[] = plainToInstance(targetClass, result[0], {
      enableImplicitConversion: true,
    });
    return [data, result[1]];
  }

  /**
   * 查询一个
   * @param options 查询条件
   * @param targetClass 对应的Entity
   * @returns 查询结果
   */
  public async queryOne<T>(
    options: any,
    targetClass: new (...args: any[]) => T,
  ): Promise<T> {
    let result = await this.repository.findOne({ where: options });
    result = plainToInstance(
      targetClass,
      { ...result },
      { enableImplicitConversion: true },
    );
    return result;
  }
}
