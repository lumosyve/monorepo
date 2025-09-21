/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 02:32:36
 * @LastEditTime: 2025-03-02 03:15:54
 * @Description: create-inventory.dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({ description: '商品id', type: String, required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入商品id' })
  goodsId;

  @ApiProperty({ description: '库存数量', type: Number, required: true })
  @IsNumber()
  @IsNotEmpty({ message: '请输入库存数量' })
  inventoryNumber;

  @ApiProperty({ description: '仓库id', type: String, required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入仓库id' })
  warehouseId;
}
