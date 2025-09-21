/*
 * @Author: ZhengJie
 * @Date: 2025-03-01 15:06:49
 * @LastEditTime: 2025-03-01 15:40:38
 * @Description: create-warehouse.dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({ description: '仓库名称', type: String, required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入仓库名称' })
  warehouseName: string;

  @ApiProperty({ description: '状态（0正常 1删除 2停用）', type: 'string' })
  // @IsNotEmpty({ message: '请输入状态' })
  status: string;
}
