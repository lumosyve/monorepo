/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: user.update.dto
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'id', type: String, required: true })
  // @IsString()
  // @IsNotEmpty({ message: '请检查id' })
  id: string;
}
