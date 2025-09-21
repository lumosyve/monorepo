/*
 * @Author: ZhengJie
 * @Date: 2023-08-08 17:48:16
 * @Description: user.dto
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { QueryPageDto } from 'src/common/dto/common.dto';

/**
 * 获取用户信息
 */
export class GetUserInfoDto {
  @IsString()
  @ApiProperty({ description: 'id' })
  @IsNotEmpty({ message: '请检查用户Id' })
  id: string;
}

/**
 * 用户分页
 */
export class GetPageDto extends QueryPageDto {
  @ApiProperty({ description: '用户编码', required: false })
  userCode: string;
  @ApiProperty({ description: '登录账号', required: false })
  loginCode: string;
  @ApiProperty({ description: '用户昵称', required: false })
  userName: string;
  @ApiProperty({ description: '电子邮箱', required: false })
  email: string;
  @ApiProperty({ description: '手机号码', required: false })
  mobile: string;
  @ApiProperty({ description: '办公电话', required: false })
  phone: string;
  @ApiProperty({ description: '用户性别（0女性 1男性）', required: false })
  sex: string;
  @ApiProperty({
    description: '管理员类型（0非管理员 1系统管理员  2二级管理员）',
    required: false,
  })
  mgrType: string;
  @ApiProperty({
    description: '状态（0正常 1删除 2停用 3冻结）',
    required: false,
  })
  status: string;
}

export class ActionByUserCodeDot {
  // @IsString()
  @ApiProperty({ description: '用户编码' })
  // @IsNotEmpty({ message: '请检查用户编码' })
  userCode?: string;

  // @IsString()
  @ApiProperty({ description: '登录账号' })
  // @IsNotEmpty({ message: '请检查用户编码' })
  loginCode?: string;

  // @IsString()
  @ApiProperty({ description: 'id' })
  // @IsNotEmpty({ message: '请检查用户编码' })
  id?: string;

  // @IsString()
  @ApiProperty({ description: 'wx_openid' })
  // @IsNotEmpty({ message: '请检查用户编码' })
  wxOpenid?: string;
}

export class DelActionByIdsDot {
  @ApiProperty({ description: 'Ids', type: Array, required: true })
  @IsNotEmpty({ message: '请检查Ids' })
  @IsArray()
  ids: string[];

  @ApiProperty({
    description: '状态（0正常 1删除 2停用）',
    type: String,
    required: false,
  })
  @IsOptional()
  status: string;
}
