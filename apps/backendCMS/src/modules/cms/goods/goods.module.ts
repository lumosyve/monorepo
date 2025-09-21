/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 01:25:59
 * @LastEditTime: 2025-03-03 15:05:10
 * @Description: goods.module
 */
import { forwardRef, Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goods } from './entities/good.entity';
import { AuthModule } from 'src/modules/sys/auth/auth.module';
import { InventoryModule } from '../inventory/inventory.module';
import { Inventory } from '../inventory/entities/inventory.entity';

const EntityFeatures = TypeOrmModule.forFeature([Goods, Inventory]);

@Module({
  imports: [
    EntityFeatures,
    forwardRef(() => AuthModule),
    forwardRef(() => InventoryModule),
  ],
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class GoodsModule {}
