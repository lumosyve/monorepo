/*
 * @Author: ZhengJie
 * @Date: 2023-10-28 22:03:56
 * @Description: 图片上传
 */
import { forwardRef, Module } from '@nestjs/common';
import { UploadImagesService } from './upload-images.service';
import { UploadImagesController } from './upload-images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { HttpModule } from '@nestjs/axios';

export const storageConfig = diskStorage({
  // 文件位置（固定形式）
  // destination: 'public/uploads/images',
  // 动态写法
  destination: (req, _file, callback) => {
    // 设置文件名，根据query.source字段设置，默认使用“common”
    const targetDir = join(
      process.cwd(),
      'public',
      'uploads',
      req.query.source ? (req.query.source as string) : 'common',
    );
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, {
        recursive: true,
      });
    }

    callback(null, targetDir);
    // callback(null, 'public/uploads/images');
  },
  filename: (req, file, callback) => {
    const path = `${Date.now()}-${Math.round(Math.random() * 1e10)}${extname(
      file.originalname,
    )}`;
    callback(null, path);
  },
});

const MulterFactory = MulterModule.registerAsync({
  useFactory() {
    return {
      storage: storageConfig,
    };
  },
});

@Module({
  imports: [MulterFactory, forwardRef(() => HttpModule)],
  controllers: [UploadImagesController],
  providers: [UploadImagesService],
})
export class UploadImagesModule {}
