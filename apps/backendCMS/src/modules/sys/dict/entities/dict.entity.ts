/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 18:19:30
 * @Description: entity.dict
 */
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sys_dict_type')
export class Dict {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'dict_name', comment: '字典名称' })
  dictName: string;

  @Column({ name: 'dict_type', comment: '字典类型' })
  dictType: string;

  @Column({ name: 'is_sys', comment: '是否系统字典' })
  isSys: number;

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
