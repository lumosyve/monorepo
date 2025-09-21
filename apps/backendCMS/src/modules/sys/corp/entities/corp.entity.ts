/*
 * @Author: ZhengJie
 * @Date: 2025-01-11 20:20:15
 * @LastEditTime: 2025-01-19 01:17:26
 * @Description: entity.corp
 */
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_corp')
export class Corp {
  @PrimaryColumn({ name: 'id', comment: 'Id' })
  id: string;

  @Column({ name: 'corp_code', comment: '租户code' })
  corpCode: string;

  @Column({ name: 'corp_name', comment: '租户名称' })
  corpName: string;

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
}
