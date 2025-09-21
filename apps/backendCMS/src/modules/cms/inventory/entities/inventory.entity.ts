/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 02:32:36
 * @LastEditTime: 2025-03-12 00:53:43
 * @Description: entity.inventory
 */
import { dateTransformer } from 'src/utils';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Goods } from '../../goods/entities/good.entity';

@Entity('msh_inventory')
export class Inventory {
  @PrimaryColumn({ name: 'id', comment: 'id' })
  id: string;

  @Column({ name: 'goods_id', comment: '商品id' })
  goodsId: string;

  @Column({ name: 'inventory_number', comment: '库存数量' })
  inventoryNumber: number;

  @Column({ name: 'warehouse_id', comment: '仓库id' })
  warehouseId: number;

  @Column({ name: 'create_by', comment: '创建者' })
  createBy: string;

  @Column({
    name: 'create_date',
    comment: '创建时间',
    transformer: dateTransformer,
  })
  createDate: Date;

  @Column({ name: 'update_by', comment: '更新者' })
  updateBy: string;

  @Column({
    name: 'update_date',
    comment: '更新时间',
    transformer: dateTransformer,
  })
  updateDate: Date;

  @OneToOne(() => Goods, (goods) => goods.inventory)
  @JoinColumn({ name: 'goods_id' })
  goods: Goods;
}
