/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 02:32:36
 * @LastEditTime: 2025-03-02 02:58:43
 * @Description: 库存管理
 */
import { Controller, Body, Put, Headers } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('库存管理')
@Controller('/cms/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Put('/mini/in')
  @ApiOperation({ summary: '更新入库' })
  updateIn(
    @Body() updateInventoryDto: UpdateInventoryDto,
    @Headers() headers: any,
  ) {
    return this.inventoryService.update(
      updateInventoryDto,
      headers.authorization,
    );
  }

  @Put('/mini/out')
  @ApiOperation({ summary: '更新出库' })
  updateOut(
    @Body() updateInventoryDto: UpdateInventoryDto,
    @Headers() headers: any,
  ) {
    return this.inventoryService.update(
      updateInventoryDto,
      headers.authorization,
    );
  }
}
