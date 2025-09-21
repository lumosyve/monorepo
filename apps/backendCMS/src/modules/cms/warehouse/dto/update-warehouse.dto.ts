/*
 * @Author: ZhengJie
 * @Date: 2025-03-01 15:06:49
 * @LastEditTime: 2025-03-01 15:47:43
 * @Description: update-warehouse.dto
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWarehouseDto } from './create-warehouse.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {
  @ApiProperty({ description: 'id', required: true })
  @IsString()
  @IsNotEmpty({ message: '请检查id' })
  id: string;
}
