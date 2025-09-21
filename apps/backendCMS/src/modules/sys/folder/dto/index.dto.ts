/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 01:29:01
 * @LastEditTime: 2025-02-14 01:29:29
 * @Description: dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { QueryPageDto } from 'src/common/dto/common.dto';

export class GetPageDto extends QueryPageDto {
  @ApiProperty({ description: '文件夹名称', type: String, required: false })
  // @IsString()
  folderName: string;

  @ApiProperty({ description: '状态', type: String, required: false })
  // @IsString()
  status: string;
}

export class ActionByIdDot {
  @ApiProperty({ description: 'Id', type: String, required: true })
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
