/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 00:51:39
 * @LastEditTime: 2025-02-14 03:52:54
 * @Description: dto.update-file
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFileDto } from './create-file.dto';

export class UpdateFileDto extends PartialType(CreateFileDto) {}
export class UpdateFileStatusDto {
  @ApiProperty({ description: 'Ids', type: String, required: false })
  ids: string[];

  @ApiProperty({ description: '状态（0正常 1删除 2停用）' })
  status: string;
}
