/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 02:32:36
 * @LastEditTime: 2025-03-02 02:52:45
 * @Description: update-inventory.dto
 */
import { PartialType } from '@nestjs/swagger';
import { CreateInventoryDto } from './create-inventory.dto';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {}
