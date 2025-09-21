/*
 * @Author: ZhengJie
 * @Date: 2023-11-02 22:32:35
 * @Description: 格式化没有值的参数
 */
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const FormatDtoEmpty = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    let targetParams = {};
    switch (req.method) {
      case 'GET':
      case 'DELETE':
        targetParams = { ...req.query };
        break;
      case 'POST':
      case 'PUT':
        targetParams = { ...req.body };
        break;

      default:
        break;
    }

    const result = {};
    Object.keys(targetParams).map((key: string) => {
      if (targetParams[key] || targetParams[key].length > 0) {
        result[key] = targetParams[key];
      }
    });
    return result;
  },
);

/**
 * 格式化分页参数
 */
export const FormatDefaultPagination = (): MethodDecorator => {
  return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (args[0] && typeof args[0] === 'object') {
        const dto = args[0];
        args[0] = {
          ...dto,
          pageNo: dto.pageNo ? +dto.pageNo : 1,
          pageSize: dto.pageSize ? +dto.pageSize : 15,
          // status: dto.status || '0',
        };
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
};

/**
 * 去除参数中为空字符串或者null的参数
 */
export const FormatEmptyParams = (): MethodDecorator => {
  return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (args[0] && typeof args[0] === 'object') {
        const targetParams = {};
        const dto = args[0];
        for (const item in dto) {
          if (dto[item] !== '' && dto[item] !== null) {
            targetParams[item] = dto[item];
          }
        }
        args[0] = {
          ...targetParams,
        };
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
};
