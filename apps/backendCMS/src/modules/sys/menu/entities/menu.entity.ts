/*
 * @Author: ZhengJie
 * @Date: 2023-10-17 22:57:06
 * @Description: entity.menu
 */
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_menu')
export class Menu {
  @PrimaryColumn({ comment: 'ID' })
  id: number;

  @Column({ name: 'parent_id', comment: '父级id' })
  parentId: number;

  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '类型' })
  type: number;

  @Column({ comment: '组件名称' })
  component: string;

  @Column({ comment: 'Code' })
  code: string;

  @Column({ comment: '路径' })
  path: string;

  @Column({ name: 'redirect_path', comment: '重定向地址' })
  redirectPath: string;

  @Column({ comment: 'Icon' })
  icon: string;

  @Column({ comment: '标题' })
  title: string;

  @Column({ comment: '是否显示' })
  hidden: number;

  @Column({ comment: '排序' })
  sort: number;

  @Column({ comment: '状态' })
  status: number;

  @Column({ comment: '备注' })
  remark: string;

  @Column({ comment: '创建者' })
  creator: string;

  @Column({ comment: '创建时间' })
  @Transform(({ value }) => value && formatDate(value))
  create_time: Date;

  @Column({ comment: '更新者' })
  updater: string;

  @Column({ comment: '更新时间' })
  @Transform(({ value }) => value && formatDate(value))
  update_time: Date;

  @Column({ comment: '是否已删除' })
  deleted: number;

  @Column({ comment: '删除时间' })
  @Transform(({ value }) => value && formatDate(value))
  deleted_time: Date;
}
