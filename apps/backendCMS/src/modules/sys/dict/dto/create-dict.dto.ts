/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 18:19:30
 * @Description: dto.create
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDictDto {
  @ApiProperty({ description: '字典名称', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入字典名称' })
  dictName: string;

  @ApiProperty({ description: '字典类型', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入字典类型' })
  dictType: string;

  @ApiProperty({ description: '系统默认（0是 1否）', type: 'number' })
  @IsNotEmpty({ message: '请输入是否系统默认' })
  isSys: number;

  @ApiProperty({ description: '状态（0正常 1删除 2停用）', type: 'string' })
  // @IsNotEmpty({ message: '请输入状态' })
  status: string;

  @ApiProperty({ description: '备注', type: 'string' })
  remarks: string;
}
