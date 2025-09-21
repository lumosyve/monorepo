/*
 * @Author: ZhengJie
 * @Date: 2025-03-01 15:06:49
 * @LastEditTime: 2025-03-01 15:50:26
 * @Description: warehouse.module
 */
import { forwardRef, Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { AuthModule } from '../../sys/auth/auth.module';

const EntityFeatures = TypeOrmModule.forFeature([Warehouse]);

@Module({
  imports: [EntityFeatures, forwardRef(() => AuthModule)],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
