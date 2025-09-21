/*
 * @Author: ZhengJie
 * @Date: 2023-10-17 22:57:06
 * @Description: dto.update
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({ description: 'id', required: true })
  @IsNumber()
  @IsNotEmpty({ message: '请检查id' })
  id: number;
}
