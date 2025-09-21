/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 01:25:59
 * @LastEditTime: 2025-03-12 15:05:45
 * @Description: 商品管理
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
import { GoodsService } from './goods.service';
import { CreateGoodDto, GoodsToStore } from './dto/create-good.dto';
import { UpdateGoodDto, UpdateGoodStoreDto } from './dto/update-good.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ActionByIdDot,
  DelActionByIdsDot,
  GetPageDto,
} from './dto/index-good.dto';

@ApiTags('商品管理')
@Controller('/cms/goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post('/mini/add')
  @ApiOperation({ summary: '新增' })
  add(@Body() createGoodDto: CreateGoodDto, @Headers() headers: any) {
    return this.goodsService.create(createGoodDto, headers.authorization);
  }

  @Post('/mini/toStore')
  @ApiOperation({ summary: '入库' })
  toStore(@Body() goodsToStore: GoodsToStore, @Headers() headers: any) {
    return this.goodsService.toStore(goodsToStore, headers.authorization);
  }

  @Delete('/mini/delete')
  @ApiOperation({ summary: '删除' })
  remove(@Body() query: DelActionByIdsDot, @Headers() headers: any) {
    return this.goodsService.remove(query, headers.authorization);
  }

  @Put('/mini/update')
  @ApiOperation({ summary: '更新' })
  update(@Body() updateGoodDto: UpdateGoodDto, @Headers() headers: any) {
    return this.goodsService.update(updateGoodDto, headers.authorization);
  }

  @Put('/mini/updateStore')
  @ApiOperation({ summary: '更新和库存' })
  updateStore(
    @Body() updateGoodStoreDto: UpdateGoodStoreDto,
    @Headers() headers: any,
  ) {
    return this.goodsService.updateToStore(
      updateGoodStoreDto,
      headers.authorization,
    );
  }

  @Get('/mini/page')
  @ApiOperation({ summary: '分页' })
  getPage(@Query() page: GetPageDto) {
    return this.goodsService.getPage(page);
  }

  @Get('/mini/list')
  @ApiOperation({ summary: '列表' })
  getList(@Query() query: { warehouseId?: string }, @Headers() headers: any) {
    return this.goodsService.getListByWarehouseId(query, headers.authorization);
  }

  @Get('/mini/info')
  @ApiOperation({ summary: '详情' })
  getInfo(@Query() detailDto: ActionByIdDot) {
    return this.goodsService.getInfo(detailDto);
  }
}
