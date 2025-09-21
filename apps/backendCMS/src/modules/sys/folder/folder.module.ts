/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 01:24:05
 * @LastEditTime: 2025-02-17 03:31:36
 * @Description: module.folder
 */
import { forwardRef, Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { FileFolder } from './entities/folder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';

const EntityFeatures = TypeOrmModule.forFeature([FileFolder]);

@Module({
  imports: [EntityFeatures, AuthModule, forwardRef(() => FilesModule)],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService],
})
export class FolderModule {}
