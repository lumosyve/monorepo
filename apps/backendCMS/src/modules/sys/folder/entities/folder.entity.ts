/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 01:24:05
 * @LastEditTime: 2025-02-14 02:20:00
 * @Description: entity.folder
 */
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_file_folder')
export class FileFolder {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'folder_name', comment: '文件夹名称' })
  folderName: string;

  @Column({ name: 'parent_id', comment: '上级文件夹' })
  parentId: string;

  @Column({ comment: '状态（0正常 1删除 2停用）' })
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

  @Column({ comment: '备注' })
  remarks: string;
}
