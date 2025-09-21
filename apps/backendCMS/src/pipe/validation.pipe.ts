/*
 * @Author: ZhengJie
 * @Date: 2023-07-28 15:44:50
 * @Description: pipe.validation
 */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ResultData } from 'src/utils/result';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const constraints = errors[0].constraints;
      const errorMsg = constraints[Object.keys(constraints)[0]];
      throw new BadRequestException(ResultData.fail(400, errorMsg));
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: Type<any>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
