/*
 * @Author: ZhengJie
 * @Date: 2023-10-28 22:03:56
 * @Description: upload-images.service
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { CreateUploadImageDto } from './dto/create-upload-image.dto';
// import { UpdateUploadImageDto } from './dto/update-upload-image.dto';

@Injectable()
export class UploadImagesService {
  constructor(private readonly configService: ConfigService) {}

  getAppServer() {
    return this.configService.get('app');
  }
}
