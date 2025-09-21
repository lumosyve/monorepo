/*
 * @Author: ZhengJie
 * @Date: 2025-01-18 15:45:37
 * @LastEditTime: 2025-01-18 16:37:48
 * @Description: dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { QueryPageDto } from 'src/common/dto/common.dto';

export class GetPageDto extends QueryPageDto {
  @ApiProperty({ description: '租户code', type: String, required: false })
  // @IsString()
  corpCode: string;

  @ApiProperty({ description: '租户名称', type: String, required: false })
  // @IsString()
  corpName: string;

  @ApiProperty({ description: '状态', type: String, required: false })
  // @IsString()
  status: string;
}

export class ActionByCodeDot {
  @ApiProperty({ description: 'corpCode', type: String, required: false })
  @IsOptional()
  corpCode: string;
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
