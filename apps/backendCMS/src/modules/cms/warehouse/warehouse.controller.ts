/*
 * @Author: ZhengJie
 * @Date: 2025-03-01 15:06:49
 * @LastEditTime: 2025-03-02 02:10:22
 * @Description: 仓库管理
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
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ActionByIdDot,
  DelActionByIdsDot,
  GetPageDto,
} from './dto/index-warehouse.dto';

@ApiTags('仓库管理')
@Controller('/cms/warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post('/mini/add')
  @ApiOperation({ summary: '新增' })
  add(@Body() createWarehouseDto: CreateWarehouseDto, @Headers() headers: any) {
    return this.warehouseService.create(
      createWarehouseDto,
      headers.authorization,
    );
  }

  @Delete('/mini/delete')
  @ApiOperation({ summary: '删除' })
  remove(@Body() query: DelActionByIdsDot, @Headers() headers: any) {
    return this.warehouseService.remove(query, headers.authorization);
  }

  @Put('/mini/update')
  @ApiOperation({ summary: '更新' })
  update(
    @Body() updateWarehouseDto: UpdateWarehouseDto,
    @Headers() headers: any,
  ) {
    return this.warehouseService.update(
      updateWarehouseDto,
      headers.authorization,
    );
  }

  @Get('/mini/page')
  @ApiOperation({ summary: '分页' })
  getPage(@Query() page: GetPageDto) {
    return this.warehouseService.getPage(page);
  }

  @Get('/mini/list')
  @ApiOperation({ summary: '列表' })
  getList(@Headers() headers: any) {
    return this.warehouseService.getList(headers.authorization);
  }

  @Get('/mini/info')
  @ApiOperation({ summary: '详情' })
  getInfo(@Query() detailDto: ActionByIdDot) {
    return this.warehouseService.getInfo(detailDto.id);
  }
}
