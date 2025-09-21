/*
 * @Author: ZhengJie
 * @Date: 2023-10-18 23:12:58
 * @Description: role.module
 */
import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

const EntityFeatures = TypeOrmModule.forFeature([Role]);

@Module({
  imports: [EntityFeatures, AuthModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
