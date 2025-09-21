/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 00:51:39
 * @LastEditTime: 2025-02-14 03:41:11
 * @Description: entity.file
 */
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_file_upload')
export class Files {
  @PrimaryColumn({ name: 'file_id', comment: '文件编号' })
  fileId: string;

  @Column({ name: 'file_name', comment: '文件名称' })
  fileName: string;

  @Column({ name: 'file_type', comment: '文件分类（image、media、file）' })
  fileType: string;

  @Column({ name: 'file_path', comment: '文件路径' })
  filePath: string;

  @Column({ name: 'file_sort', comment: '文件排序（升序）' })
  fileSort: number;

  @Column({ name: 'file_size', comment: '文件大小' })
  fileSize: number;

  @Column({ name: 'folder_id', comment: '文件夹ID' })
  folderId: string;

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
