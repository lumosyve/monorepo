/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: user.create.dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户编码', type: String, required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入用户编码' })
  userCode: string;

  @ApiProperty({ description: '登录账号', type: String, required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入登录账号' })
  loginCode: string;

  @ApiProperty({ description: '用户昵称', type: String, required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入用户昵称' })
  userName: string;

  @ApiProperty({ description: '登录密码', type: String, required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入登录密码' })
  password: string;

  @ApiProperty({ description: '电子邮箱', type: String, required: false })
  email: string;

  @ApiProperty({ description: '手机号码', type: String, required: false })
  mobile: string;

  @ApiProperty({ description: '办公电话', type: String, required: false })
  phone: string;

  @ApiProperty({
    description: '用户性别（0女性 1男性）',
    type: String,
    required: false,
  })
  sex: string;

  @ApiProperty({ description: '头像路径', type: String, required: false })
  avatar: string;

  @ApiProperty({ description: '个性签名', type: String, required: false })
  sign: string;

  @ApiProperty({ description: '绑定的微信号', type: String, required: false })
  wxOpenid: string;

  @ApiProperty({
    description: '用户类型（参考sys_user_type）',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '请输入用户类型（参考sys_user_type）' })
  userType: string;

  @ApiProperty({
    description: '用户类型引用编号',
    type: String,
    required: false,
  })
  refCode: string;

  @ApiProperty({
    description: '用户类型引用姓名',
    type: String,
    required: false,
  })
  refName: string;

  @ApiProperty({
    description: '管理员类型（0非管理员 1系统管理员  2二级管理员）',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty({
    message: '请输入管理员类型（0非管理员 1系统管理员  2二级管理员）',
  })
  mgrType: string;

  @ApiProperty({
    description: '密码安全级别（0初始 1很弱 2弱 3安全 4很安全）',
    type: Number,
    required: false,
  })
  pwdSecurityLevel: number;

  @ApiProperty({
    description: '密码最后更新时间',
    type: Number,
    required: false,
  })
  pwdUpdateDate: number;

  @ApiProperty({ description: '密码修改记录', type: String, required: false })
  pwdUpdateRecord: string;

  @ApiProperty({ description: '密保问题', type: String, required: false })
  pwdQuestion: string;

  @ApiProperty({ description: '密保问题答案', type: String, required: false })
  pwdQuestionAnswer: string;

  @ApiProperty({ description: '密保问题2', type: String, required: false })
  pwdQuestion2: string;

  @ApiProperty({ description: '密保问题答案2', type: String, required: false })
  pwdQuestionAnswer2: string;

  @ApiProperty({ description: '密保问题3', type: String, required: false })
  pwdQuestion3: string;

  @ApiProperty({ description: '密保问题答案3', type: String, required: false })
  pwdQuestionAnswer3: string;

  @ApiProperty({
    description: '密码问题修改时间',
    type: Number,
    required: false,
  })
  pwdQuestUpdateDate: number;

  @ApiProperty({ description: '最后登陆IP', type: String, required: false })
  lastLoginIp: string;

  @ApiProperty({ description: '最后登陆时间', type: Number, required: false })
  lastLoginDate: number;

  @ApiProperty({ description: '冻结时间', type: Number, required: false })
  freezeDate: number;

  @ApiProperty({ description: '冻结原因', type: String, required: false })
  freezeCause: string;

  @ApiProperty({
    description: '用户权重（降序）',
    type: Number,
    required: false,
  })
  userWeight: number;

  @ApiProperty({
    description: '状态（0正常 1删除 2停用 3冻结）',
    type: String,
    required: true,
  })
  // @IsNotEmpty({ message: '请输入状态' })
  status: string;

  // @ApiProperty({ description: '创建者', type: String, required: false })
  // createBy: string;

  // @ApiProperty({ description: '创建时间', type: Number, required: false })
  // createDate: number;

  // @ApiProperty({ description: '更新者', type: String, required: false })
  // updateBy: string;

  // @ApiProperty({ description: '更新时间', type: Number, required: false })
  // updateDate: number;

  @ApiProperty({ description: '备注信息', type: String, required: false })
  remarks: string;

  // @ApiProperty({ description: '租户代码', type: String, required: false })
  // corpCode: string;

  // @ApiProperty({ description: '租户名称', type: String, required: false })
  // corpName: string;
}
