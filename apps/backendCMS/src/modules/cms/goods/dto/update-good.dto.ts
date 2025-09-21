/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 01:25:59
 * @LastEditTime: 2025-03-04 17:59:08
 * @Description: update-goods.dto
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGoodDto } from './create-good.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateInventoryDto } from '../../inventory/dto/create-inventory.dto';

export class UpdateGoodDto extends PartialType(CreateGoodDto) {
  @ApiProperty({ description: 'id', required: true })
  @IsString()
  @IsNotEmpty({ message: '请检查id' })
  id: string;
}
export class UpdateGoodStoreDto extends PartialType(CreateGoodDto) {
  @ApiProperty({ description: 'id', required: true })
  @IsString()
  @IsNotEmpty({ message: '请检查id' })
  id: string;

  @ApiProperty({ description: '库存信息', required: true })
  @IsNotEmpty({ message: '请检查库存信息' })
  inventory: CreateInventoryDto;
}
