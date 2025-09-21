/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 02:32:36
 * @LastEditTime: 2025-03-02 02:40:26
 * @Description: inventory.module
 */
import { forwardRef, Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { AuthModule } from 'src/modules/sys/auth/auth.module';

const EntityFeatures = TypeOrmModule.forFeature([Inventory]);

@Module({
  imports: [EntityFeatures, forwardRef(() => AuthModule)],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
