/*
 * @Author: ZhengJie
 * @Date: 2023-10-28 22:03:56
 * @Description: uploadImages.controller
 */
import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UploadImagesService } from './upload-images.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  UploadImg,
  UploadImgs,
} from 'src/common/decorators/upload-img.decorator';
import { ResultData } from 'src/utils/result';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import { snowflakeID } from 'src/utils';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@ApiTags('图片上传')
@Controller('/sys/upload-images')
export class UploadImagesController {
  constructor(
    private readonly uploadImagesService: UploadImagesService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  @Post('')
  @UploadImgs()
  @ApiOperation({ summary: '上传图片多个' })
  @CatchErrors()
  uploadImages(@UploadedFiles() files: { files: Express.Multer.File[] }) {
    const { host, port } = this.uploadImagesService.getAppServer();
    const result = files.files.map((file) => {
      return {
        name: file.filename,
        size: file.size,
        // url: `http://${host}:${port}/${file.path}`,
        url: `/${file.path.replace(process.cwd() + '/public', '')}`,
      };
    });
    return ResultData.ok(result);
  }

  @Post('item')
  @UploadImg()
  @ApiOperation({ summary: '上传图片单个' })
  @CatchErrors()
  uploadImageItem(@UploadedFile() file: Express.Multer.File) {
    const { host, port } = this.uploadImagesService.getAppServer();
    return ResultData.ok({
      name: file.filename,
      size: file.size,
      id: snowflakeID.NextId() + '',
      // 因为使用了动态创建路径，所以这里的路径是绝对路径，需要replace
      // url: `http://${host}:${port}${file.path.replace(process.cwd(), '')}`,
      url: `${file.path.replace(process.cwd() + '/public', '')}`,
    });
  }

  @Get('img-ocr')
  @ApiOperation({ summary: 'ocr图片识别(url)' })
  @CatchErrors()
  async imageOCRItem(@Query() data: { url: string }) {
    const { ocrHost } = this.uploadImagesService.getAppServer();
    const resultObservable = this.httpService.get(`${ocrHost}/img-ocr`, {
      params: {
        url: data.url,
      },
    });
    const result: any = await lastValueFrom(resultObservable);
    return ResultData.ok(result.data);
  }

  // @Get('file-ocr')
  // @UploadImg()
  // @ApiOperation({ summary: 'ocr图片识别' })
  // @CatchErrors()
  // async uploadImageOCRItem(@UploadedFile() file: Express.Multer.File) {
  //   const { host, port, ocrHost } = this.uploadImagesService.getAppServer();
  //   const serverFilePath = `${host}:${port}${file.path.replace(
  //     process.cwd() + '/public',
  //     '',
  //   )}`;
  //   const resultObservable = this.httpService.get(`${ocrHost}/img-ocr`, {
  //     params: {
  //       url: serverFilePath,
  //     },
  //   });

  //   const result: any = await lastValueFrom(resultObservable);
  //   return ResultData.ok(result.data);
  // }
}
