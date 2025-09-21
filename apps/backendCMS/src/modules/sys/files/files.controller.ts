/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 00:51:39
 * @LastEditTime: 2025-02-16 16:39:42
 * @Description: controller.files
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  Headers,
  Query,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto, CreateFileFormDataDto } from './dto/create-file.dto';
import { UpdateFileDto, UpdateFileStatusDto } from './dto/update-file.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '../upload-images/upload-images.module';
import {
  ActionByCodeDot,
  DelActionByIdsDot,
  GetPageDto,
} from './dto/index.dto';

@ApiTags('文件管理')
@Controller('/sys/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig }))
  @ApiOperation({ summary: '新增' })
  addFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() formData: CreateFileFormDataDto,
    @Headers() headers: any,
  ) {
    // console.log('file', file);
    // console.log('formData', formData);
    // console.log('file.path', file.path.replace(process.cwd(), ''));
    return this.filesService.create(
      {
        folderId: formData.folderId,
        fileName: file.filename,
        fileType: file.mimetype.includes('image') ? '1' : '2',
        fileSize: file.size,
        filePath: file.path.replace(process.cwd(), ''),
        status: formData.status || '0',
        remarks: formData.remarks,
      },
      headers.authorization,
    );
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除' })
  remove(@Body() query: DelActionByIdsDot, @Headers() headers: any) {
    return this.filesService.remove(query, headers.authorization);
  }

  @Put('update-status')
  @ApiOperation({ summary: '更新可用状态' })
  updateStatus(
    @Body() updateCorpDto: UpdateFileStatusDto,
    @Headers() headers: any,
  ) {
    return this.filesService.updateStatus(updateCorpDto, headers.authorization);
  }

  @Get('page')
  @ApiOperation({ summary: '分页' })
  getPage(@Query() page: GetPageDto) {
    return this.filesService.getPage(page);
  }

  @Get('list')
  @ApiOperation({ summary: '列表' })
  getList() {
    return this.filesService.getList();
  }

  @Get('info')
  @ApiOperation({ summary: '详情' })
  getInfo(@Query() detailDto: ActionByCodeDot) {
    return this.filesService.getInfo(detailDto.id);
  }
}
