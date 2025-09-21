/*
 * @Author: ZhengJie
 * @Date: 2023-09-17 23:34:13
 * @Description: entity.dictData
 */
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_dict_data')
export class DictDatum {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'parent_code', comment: '父级编号' })
  parentCode: string;

  @Column({ name: 'dict_label', comment: '字典标签' })
  dictLabel: string;

  @Column({ name: 'dict_value', comment: '字典键值' })
  dictValue: string;

  @Column({ comment: '排序号（升序）' })
  sort: number;

  @Column({ name: 'dict_icon', comment: '字典图标' })
  dictIcon: string;

  @Column({ name: 'dict_type', comment: '字典类型' })
  dictType: string;

  @Column({ name: 'is_sys', comment: '系统内置（1是 0否）' })
  isSys: number;

  @Column({ name: 'css_style', comment: 'css样式（如：color:red)' })
  cssStyle: string;

  @Column({ name: 'css_class', comment: 'css类名（如：red）' })
  cssClass: string;

  @Column({ comment: '状态（0正常 1删除 2停用）' })
  status: string;

  @Column({ comment: '字典描述' })
  description: string;

  @Column({ comment: '备注信息' })
  remarks: string;

  @Column({ name: 'corp_code', comment: '租户代码' })
  corpCode: string;

  @Column({ name: 'corp_name', comment: '租户名称' })
  corpName: string;

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
