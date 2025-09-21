/*
 * @Author: ZhengJie
 * @Date: 2023-10-17 22:57:06
 * @Description: module.menu
 */
import { Module, forwardRef } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { AuthModule } from '../auth/auth.module';

const EntityFeatures = TypeOrmModule.forFeature([Menu]);

@Module({
  imports: [EntityFeatures, forwardRef(() => AuthModule)],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
