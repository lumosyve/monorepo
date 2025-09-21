/*
 * @Author: ZhengJie
 * @Date: 2023-10-18 23:12:58
 * @Description: dto.create
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色编码' })
  @IsString()
  @IsNotEmpty({ message: '请输入角色编码' })
  roleCode: string;

  @ApiProperty({ description: '角色名称' })
  @IsString()
  @IsNotEmpty({ message: '请输入角色名称' })
  roleName: string;

  @ApiProperty({ description: '角色排序（升序）' })
  roleSort: number;

  @ApiProperty({ description: '系统内置（1是 0否）' })
  isSys: string;

  @ApiProperty({ description: '用户类型（employee员工 member会员）' })
  userType: string;

  @ApiProperty({ description: '桌面地址（仪表盘地址）' })
  desktopUrl: string;

  @ApiProperty({ description: '状态（0正常 1删除 2停用）' })
  // @IsString()
  // @IsNotEmpty({ message: '请输入状态' })
  status?: string;

  @ApiProperty({ description: '备注信息' })
  remarks: string;

  // @ApiProperty({ description: '租户代码' })
  // @IsString()
  // @IsNotEmpty({ message: '请输入租户代码' })
  // corpCode: string;

  // @ApiProperty({ description: '租户名称' })
  // @IsString()
  // @IsNotEmpty({ message: '请输入租户名称' })
  // corpName: string;
}
