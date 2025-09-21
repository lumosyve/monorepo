/*
 * @Author: ZhengJie
 * @Date: 2025-01-11 20:20:15
 * @LastEditTime: 2025-01-24 02:45:53
 * @Description: corp.controller
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
  Query,
  Headers,
} from '@nestjs/common';
import { CorpService } from './corp.service';
import { CreateCorpDto } from './dto/create-corp.dto';
import { UpdateCorpDto } from './dto/update-corp.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ActionByCodeDot,
  DelActionByIdsDot,
  GetPageDto,
} from './dto/index-corp.dto';

@ApiTags('租户（企业）管理')
@Controller('/sys/corp')
export class CorpController {
  constructor(private readonly corpService: CorpService) {}

  @Post('add')
  @ApiOperation({ summary: '新增' })
  add(@Body() createCorpDto: CreateCorpDto, @Headers() headers: any) {
    return this.corpService.create(createCorpDto, headers.authorization);
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除' })
  remove(@Body() query: DelActionByIdsDot, @Headers() headers: any) {
    return this.corpService.remove(query, headers.authorization);
  }

  @Put('update')
  @ApiOperation({ summary: '更新' })
  update(@Body() updateCorpDto: UpdateCorpDto, @Headers() headers: any) {
    return this.corpService.update(updateCorpDto, headers.authorization);
  }

  @Get('page')
  @ApiOperation({ summary: '分页' })
  getPage(@Query() page: GetPageDto) {
    return this.corpService.getPage(page);
  }

  @Get('list')
  @ApiOperation({ summary: '列表' })
  getList() {
    return this.corpService.getList();
  }

  @Get('info')
  @ApiOperation({ summary: '详情' })
  getInfo(@Query() detailDto: ActionByCodeDot) {
    return this.corpService.getInfo(detailDto.corpCode);
  }
}
