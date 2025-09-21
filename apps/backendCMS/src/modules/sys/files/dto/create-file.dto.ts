/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 00:51:39
 * @LastEditTime: 2025-02-14 03:41:56
 * @Description: dto.create-file
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFileFormDataDto {
  @ApiProperty({ description: '文件夹ID', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入文件夹ID' })
  folderId: string;

  @ApiProperty({ description: '状态（0正常 1删除 2停用）' })
  status: string;

  @ApiProperty({ description: '备注信息' })
  remarks: string;
}
export class CreateFileDto {
  @ApiProperty({ description: '文件夹ID', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入文件夹ID' })
  folderId: string;

  @ApiProperty({ description: '文件名称', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入文件名称' })
  fileName: string;

  @ApiProperty({ description: '文件路径', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入文件路径' })
  filePath: string;

  @ApiProperty({
    description: '文件分类（0文件、1图片、2视频）',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '请输入文件分类' })
  fileType: string;

  // @ApiProperty({ description: '文件排序（升序）' })
  // fileSort: number;

  @ApiProperty({ description: '文件大小', type: 'number', required: true })
  @IsNumber()
  @IsNotEmpty({ message: '请输入文件大小' })
  fileSize: number;

  @ApiProperty({ description: '状态（0正常 1删除 2停用）' })
  status: string;

  @ApiProperty({ description: '备注信息' })
  remarks: string;
}
