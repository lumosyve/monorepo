/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 01:24:05
 * @LastEditTime: 2025-02-17 03:35:02
 * @Description: controller.folder
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Headers,
  Put,
  Query,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActionByIdDot, DelActionByIdsDot, GetPageDto } from './dto/index.dto';

@ApiTags('文件夹管理')
@Controller('/sys/folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post('add')
  @ApiOperation({ summary: '新增' })
  add(@Body() createDictDto: CreateFolderDto, @Headers() headers: any) {
    return this.folderService.create(createDictDto, headers.authorization);
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除' })
  remove(@Body() query: DelActionByIdsDot, @Headers() headers: any) {
    return this.folderService.remove(query, headers.authorization);
  }

  @Put('update')
  @ApiOperation({ summary: '更新' })
  update(@Body() updateDictDto: UpdateFolderDto, @Headers() headers: any) {
    return this.folderService.update(updateDictDto, headers.authorization);
  }

  @Get('page')
  @ApiOperation({ summary: '分页' })
  getPage(@Query() page: GetPageDto) {
    // return this.folderService.getPage(page);
  }

  @Get('list')
  @ApiOperation({ summary: '列表' })
  getList() {
    return this.folderService.getList();
  }

  @Get('treeData')
  @ApiOperation({ summary: '树' })
  getTree() {
    return this.folderService.getTreeData();
  }

  @Get('info')
  @ApiOperation({ summary: '详情' })
  getInfo(@Query() detailDto: ActionByIdDot) {
    return this.folderService.getInfo(detailDto.id);
  }

  @Get('files')
  @ApiOperation({ summary: '文件夹内文件' })
  getFolderFiles(@Query() data: ActionByIdDot) {
    return this.folderService.getFolderFiles(data.id);
  }
}
