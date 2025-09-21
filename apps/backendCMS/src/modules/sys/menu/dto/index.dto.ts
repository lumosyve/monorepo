/*
 * @Author: ZhengJie
 * @Date: 2023-10-17 23:48:49
 * @Description: dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { QueryPageDto } from 'src/common/dto/common.dto';

export class GetPageDto extends QueryPageDto {
  @ApiProperty({ description: '菜单名称', type: String, required: false })
  name: string;
  @ApiProperty({ description: '菜单类型', type: String, required: false })
  type: string;
  @ApiProperty({ description: '状态', type: Number, required: false })
  status: number;
}
