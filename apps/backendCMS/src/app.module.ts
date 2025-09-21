/*
 * @Author: ZhengJie
 * @Date: 2023-07-27 22:23:42
 * @Description: app.module
 */
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
// import { AppController } from './app.controller';
// import { LoggerMiddleware } from './middleware/log.middleware';
import { LoginMiddleware } from './middleware/login.middleware';
// import { UserModule } from './modules/sys/user/user.module';
import { CacheModule } from './modules/cache/cache.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/sys/auth/auth.module';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { DictModule } from './modules/sys/dict/dict.module';
import { DictDataModule } from './modules/sys/dict-data/dict-data.module';
import { MenuModule } from './modules/sys/menu/menu.module';
import { RoleModule } from './modules/sys/role/role.module';
import { UploadImagesModule } from './modules/sys/upload-images/upload-images.module';
import { CorpModule } from './modules/sys/corp/corp.module';
import { FilesModule } from './modules/sys/files/files.module';
import { FolderModule } from './modules/sys/folder/folder.module';
import { WarehouseModule } from './modules/cms/warehouse/warehouse.module';
import { GoodsModule } from './modules/cms/goods/goods.module';
import { InventoryModule } from './modules/cms/inventory/inventory.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    // mysql
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          logger: false,
          autoLoadEntities: true,
          ...config.get('db.mysql'),
        } as TypeOrmModuleOptions;
      },
    }),
    // redisCahce
    CacheModule,
    // 常规模块
    AuthModule,
    // UserModule,
    // ViewsModule,
    DictModule,
    DictDataModule,
    MenuModule,
    RoleModule,
    UploadImagesModule,
    CorpModule,
    FilesModule,
    FolderModule,
    WarehouseModule,
    GoodsModule,
    InventoryModule,
    // CorpModule,
  ],
  // controllers: [AppController],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // .apply(LoggerMiddleware, LoginMiddleware)
    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
