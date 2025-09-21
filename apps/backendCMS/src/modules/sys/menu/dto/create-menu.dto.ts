/*
 * @Author: ZhengJie
 * @Date: 2023-10-17 22:57:06
 * @Description: dto.create
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: '上级菜单', type: 'number', required: true })
  @IsNumber()
  @IsNotEmpty({ message: '请选择上级菜单' })
  parentId: number;

  @ApiProperty({ description: '名称', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入名称' })
  name: string;

  @ApiProperty({ description: '路径', type: 'string' })
  path: string;
  @ApiProperty({ description: '重定向路径', type: 'string' })
  redirectPath: string;

  @ApiProperty({ description: '组件名称', type: 'string' })
  component: string;

  @ApiProperty({ description: 'Icon', type: 'string' })
  icon: string;

  @ApiProperty({ description: '标题', type: 'string' })
  title: string;

  @ApiProperty({ description: '菜单类型', type: 'number', required: true })
  @IsNumber()
  @IsNotEmpty({ message: '请输入菜单类型' })
  type: number;

  @ApiProperty({ description: 'Code', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入Code' })
  code: string;

  @ApiProperty({ description: '排序', type: 'number', required: true })
  @IsNumber()
  @IsNotEmpty({ message: '请输入排序' })
  sort: number;

  @ApiProperty({ description: '状态（0正常 1停用）', type: 'number' })
  status: number;

  @ApiProperty({ description: '备注', type: 'string' })
  remark: string;

  @ApiProperty({ description: '创建者', type: 'string' })
  creator: string;

  @ApiProperty({ description: '创建时间', type: 'string', format: 'date-time' })
  create_time: Date;

  @ApiProperty({ description: '更新者', type: 'string' })
  updater: string;

  @ApiProperty({ description: '更新时间', type: 'string', format: 'date-time' })
  update_time: Date;

  @ApiProperty({ description: '是否删除', type: 'number' })
  deleted: number;

  @ApiProperty({ description: '删除时间', type: 'string', format: 'date-time' })
  deleted_time: Date;
}
