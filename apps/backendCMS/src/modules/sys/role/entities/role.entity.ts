/*
 * @Author: ZhengJie
 * @Date: 2023-10-18 23:12:58
 * @Description: Entity.role
 */
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_role')
export class Role {
  /* ID */
  @PrimaryColumn()
  id: string;

  @Column({ name: 'role_code', comment: '角色编码' })
  roleCode: string;

  @Column({ name: 'role_name', comment: '角色名称' })
  roleName: string;

  @Column({ name: 'role_sort', comment: '角色排序（升序）' })
  roleSort: number;

  @Column({ name: 'is_sys', comment: '系统内置（1是 0否）' })
  isSys: string;

  @Column({ name: 'user_type', comment: '用户类型（employee员工 member会员）' })
  userType: string;

  @Column({ name: 'desktop_url', comment: '桌面地址（仪表盘地址）' })
  desktopUrl: string;

  @Column({ name: 'status', comment: '状态（0正常 1删除 2停用）' })
  status: string;

  @Column({ name: 'create_by', comment: '创建者' })
  createBy: string;

  @Column({ name: 'create_date', comment: '创建时间' })
  @Transform(({ value }) => value && formatDate(value))
  createDate: Date;

  @Column({ name: 'update_by', comment: '更新者' })
  updateBy: string;

  @Column({ name: 'update_date', comment: '更新时间' })
  @Transform(({ value }) => value && formatDate(value))
  updateDate: Date;

  @Column({ name: 'remarks', comment: '备注信息' })
  remarks: string;

  @Column({ name: 'corp_code', comment: '租户代码' })
  corpCode: string;

  @Column({ name: 'corp_name', comment: '租户名称' })
  corpName: string;
}
