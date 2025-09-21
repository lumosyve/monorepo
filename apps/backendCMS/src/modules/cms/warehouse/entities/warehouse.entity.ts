/*
 * @Author: ZhengJie
 * @Date: 2025-03-01 15:06:49
 * @LastEditTime: 2025-03-01 15:19:47
 * @Description: entity.warehouse
 */
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('msh_warehouse')
export class Warehouse {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'warehouse_name', comment: '仓库名称' })
  warehouseName: string;

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
}
