/*
 * @Author: ZhengJie
 * @Date: 2025-01-11 20:20:15
 * @LastEditTime: 2025-01-18 16:46:27
 * @Description: create-corp.dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCorpDto {
  @ApiProperty({ description: '租户code', type: String, required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入租户code' })
  corpCode: string;

  @ApiProperty({ description: '租户名称', type: String, required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入租户名称' })
  corpName: string;

  @ApiProperty({ description: '状态（0正常 1删除 2停用）', type: 'string' })
  // @IsNotEmpty({ message: '请输入状态' })
  status: string;

  @ApiProperty({ description: '备注', type: 'string' })
  remarks: string;
}
