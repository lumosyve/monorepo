/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 20:31:38
 * @Description: dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { QueryPageDto } from 'src/common/dto/common.dto';

export class GetPageDto extends QueryPageDto {
  @ApiProperty({ description: '字典类型', type: String, required: false })
  @IsOptional()
  dictType: string;

  @ApiProperty({ description: '字典名称', type: String, required: false })
  @IsOptional()
  dictLabel: string;

  @ApiProperty({ description: '字典键值', type: String, required: false })
  @IsOptional()
  dictValue: string;

  @ApiProperty({ description: '系统内置', type: String, required: false })
  @IsOptional()
  isSys: number;

  @ApiProperty({ description: '状态', type: String, required: false })
  @IsOptional()
  @IsString()
  status: string;
}

export class ActionByIdDot {
  @ApiProperty({ description: 'id', type: String, required: true })
  @IsNotEmpty({ message: '请检查Id' })
  @IsString()
  id: string;
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

export class ListByType {
  @ApiProperty({ description: '字典类型', type: String, required: false })
  @IsOptional()
  dictType: string;
}
