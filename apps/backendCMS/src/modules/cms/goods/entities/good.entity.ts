/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 01:25:59
 * @LastEditTime: 2025-03-12 15:11:39
 * @Description: entity.goods
 */
import { dateTransformer, formatDate } from 'src/utils';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { Transform } from 'class-transformer';

@Entity('msh_goods')
export class Goods {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'goods_name', comment: '商品名称' })
  goodsName: string;

  @Column({ name: 'goods_bar_code', comment: '商品条形码' })
  goodsBarCode: string;

  @Column({ name: 'goods_img', comment: '商品图片' })
  goodsImg: string;

  @Column({ name: 'status', comment: '状态（0正常 1删除 2停用）' })
  status: string;

  @Column({ name: 'create_by', comment: '创建者' })
  createBy: string;

  @Column({
    name: 'create_date',
    comment: '创建时间',
    transformer: dateTransformer,
  })
  @Transform(({ value }) => value && formatDate(value))
  createDate: Date;

  @Column({ name: 'update_by', comment: '更新者' })
  updateBy: string;

  @Column({
    name: 'update_date',
    comment: '更新时间',
    transformer: dateTransformer,
  })
  @Transform(({ value }) => value && formatDate(value))
  updateDate: Date;

  @OneToOne(() => Inventory, (inventory) => inventory.goods)
  inventory: Inventory;
}
