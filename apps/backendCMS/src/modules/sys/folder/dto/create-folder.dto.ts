/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 01:24:05
 * @LastEditTime: 2025-02-14 02:17:38
 * @Description: dto.create-folder
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ description: '文件夹名称', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入文件夹名称' })
  folderName: string;

  @ApiProperty({ description: '上级文件夹', type: 'string', required: false })
  @IsOptional()
  parentId: string;

  @ApiProperty({
    description: '状态（0正常 1删除 2停用）',
    type: 'string',
  })
  status: string;

  @ApiProperty({ description: '备注', type: 'string' })
  remarks: string;
}
