/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 01:25:59
 * @LastEditTime: 2025-03-09 02:14:23
 * @Description: create-good.dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGoodDto {
  @ApiProperty({ description: '商品名称', type: String, required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入商品名称' })
  goodsName: string;

  @ApiProperty({ description: '商品条码', type: String, required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入商品条码' })
  goodsBarCode: string;

  @ApiProperty({ description: '商品图片', type: String, required: true })
  // @IsString()
  // @IsNotEmpty({ message: '请输入商品名称' })
  goodsImg: string;

  @ApiProperty({ description: '状态（0正常 1删除 2停用）', type: 'string' })
  // @IsNotEmpty({ message: '请输入状态' })
  status: string;
}

export class GoodsToStore extends CreateGoodDto {
  @ApiProperty({ description: '商品id', type: 'string' })
  goodsId: string;

  @ApiProperty({ description: '仓库id', type: 'string' })
  warehouseId: string;

  @ApiProperty({ description: '商品图片', type: 'string' })
  goodsImg: string;

  @ApiProperty({ description: '库存数量', type: Number, required: true })
  @IsNumber()
  @IsNotEmpty({ message: '请输入库存数量' })
  goodsNum: string;
}
