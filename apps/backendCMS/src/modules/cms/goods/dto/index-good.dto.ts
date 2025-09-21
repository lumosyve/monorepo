/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 01:34:31
 * @LastEditTime: 2025-03-04 17:27:11
 * @Description: dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { QueryPageDto } from 'src/common/dto/common.dto';

export class GetPageDto extends QueryPageDto {
  @ApiProperty({ description: '商品名称', type: String, required: false })
  // @IsString()
  goodsName: string;

  @ApiProperty({ description: '状态', type: String, required: false })
  // @IsString()
  status: string;
}

export class ActionByIdDot {
  @ApiProperty({ description: 'id', type: String, required: false })
  @IsOptional()
  id: string;

  @ApiProperty({ description: '商品条形码', type: String, required: false })
  @IsOptional()
  goodsBarCode: string;
}

export class DelActionByIdsDot {
  @ApiProperty({ description: 'Ids', type: Array, required: true })
  @IsNotEmpty({ message: '请检查Ids' })
  @IsArray()
  ids: string[];

  @ApiProperty({
    description: '状态（0正常 1删除 2停用）',
    type: String,
    required: false,
  })
  @IsOptional()
  status: string;
}
