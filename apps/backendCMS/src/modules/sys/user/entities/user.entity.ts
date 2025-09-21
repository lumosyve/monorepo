/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: entity.user
 */
import { Exclude, Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_user')
export class User {
  /* 用户编码 */
  @PrimaryColumn({ name: 'id', comment: 'ID' })
  id: string;

  /* 用户编码 */
  @Column({ name: 'user_code', comment: '用户编码' })
  userCode: string;

  /* 登录账号 */
  @Column({ name: 'login_code', comment: '登录账号' })
  loginCode: string;

  /* 用户昵称 */
  @Column({ name: 'user_name', comment: '用户昵称' })
  userName: string;

  /* 登录密码 */
  @Column({ name: 'password', comment: '登录密码' })
  password: string;

  /* 电子邮箱 */
  @Column({ name: 'email', comment: '电子邮箱' })
  email: string;

  /* 手机号码 */
  @Column({ name: 'mobile', comment: '手机号码' })
  mobile: string;

  /* 办公电话 */
  @Column({ name: 'phone', comment: '办公电话' })
  phone: string;

  /* 用户性别（0女性 1男性） */
  @Column({ name: 'sex', comment: '用户性别（0女性 1男性）' })
  sex: string;

  /* 头像路径 */
  @Column({ name: 'avatar', comment: '头像路径' })
  avatar: string;

  /* 个性签名 */
  @Column({ name: 'sign', comment: '个性签名' })
  sign: string;

  /* 绑定的微信号 */
  @Column({ name: 'wx_openid', comment: '绑定的微信号' })
  wxOpenid: string;

  /* 用户类型（参考sys_user_type） */
  @Column({ name: 'user_type', comment: '用户类型（参考sys_user_type）' })
  userType: string;

  /* 用户类型引用编号 */
  @Column({ name: 'ref_code', comment: '用户类型引用编号' })
  refCode: string;

  /* 用户类型引用姓名 */
  @Column({ name: 'ref_name', comment: '用户类型引用姓名' })
  refName: string;

  /* 管理员类型（0非管理员 1系统管理员  2二级管理员） */
  @Column({
    name: 'mgr_type',
    comment: '管理员类型（0非管理员 1系统管理员  2二级管理员）',
  })
  mgrType: string;

  /* 密码安全级别（0初始 1很弱 2弱 3安全 4很安全） */
  @Column({
    name: 'pwd_security_level',
    comment: '密码安全级别（0初始 1很弱 2弱 3安全 4很安全）',
  })
  pwdSecurityLevel: number;

  /* 密码最后更新时间 */
  @Column({ name: 'pwd_update_date', comment: '密码最后更新时间' })
  @Transform(({ value }) => value && formatDate(value))
  pwdUpdateDate: Date;

  /* 密码修改记录 */
  @Column({ name: 'pwd_update_record', comment: '密码修改记录' })
  pwdUpdateRecord: string;

  /* 密保问题 */
  @Column({ name: 'pwd_question', comment: '密保问题' })
  pwdQuestion: string;

  /* 密保问题答案 */
  @Column({ name: 'pwd_question_answer', comment: '密保问题答案' })
  pwdQuestionAnswer: string;

  /* 密保问题2 */
  @Column({ name: 'pwd_question_2', comment: '密保问题2' })
  pwdQuestion2: string;

  /* 密保问题答案2 */
  @Column({ name: 'pwd_question_answer_2', comment: '密保问题答案2' })
  pwdQuestionAnswer2: string;

  /* 密保问题3 */
  @Column({ name: 'pwd_question_3', comment: '密保问题3' })
  pwdQuestion3: string;

  /* 密保问题答案3 */
  @Column({ name: 'pwd_question_answer_3', comment: '密保问题答案3' })
  pwdQuestionAnswer3: string;

  /* 密码问题修改时间 */
  @Column({
    name: 'pwd_quest_update_date',
    comment: '密码问题修改时间',
  })
  @Transform(({ value }) => value && formatDate(value))
  pwdQuestUpdateDate: Date;

  /* 最后登陆IP */
  @Column({ name: 'last_login_ip', comment: '最后登陆IP' })
  lastLoginIp: string;

  /* 最后登陆时间 */
  @Column({ name: 'last_login_date', comment: '最后登陆时间' })
  @Transform(({ value }) => value && formatDate(value))
  lastLoginDate: Date;

  /* 冻结时间 */
  @Column({ name: 'freeze_date', comment: '冻结时间' })
  @Transform(({ value }) => value && formatDate(value))
  freezeDate: Date;

  /* 冻结原因 */
  @Column({ name: 'freeze_cause', comment: '冻结原因' })
  freezeCause: string;

  /* 用户权重（降序） */
  @Column({ name: 'user_weight', comment: '用户权重（降序）' })
  userWeight: number;

  /* 状态（0正常 1删除 2停用 3冻结） */
  @Column({ name: 'status', comment: '状态（0正常 1删除 2停用 3冻结）' })
  status: string;

  /* 创建者 */
  @Column({ name: 'create_by', comment: '创建者' })
  createBy: string;

  /* 创建时间 */
  @Column({ name: 'create_date', comment: '创建时间' })
  @Transform(({ value }) => value && formatDate(value))
  createDate: Date;

  /* 更新者 */
  @Column({ name: 'update_by', comment: '更新者' })
  updateBy: string;

  /* 更新时间 */
  @Column({ name: 'update_date', comment: '更新时间' })
  @Transform(({ value }) => value && formatDate(value))
  updateDate: Date;

  /* 备注信息 */
  @Column({ name: 'remarks', comment: '备注信息' })
  remarks: string;

  /* 租户代码 */
  @Column({ name: 'corp_code', comment: '租户代码' })
  corpCode: string;

  /* 租户名称 */
  @Column({ name: 'corp_name', comment: '租户名称' })
  corpName: string;
}
