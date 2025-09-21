/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 03:44:30
 * @LastEditTime: 2025-02-14 03:58:29
 * @Description: dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { QueryPageDto } from 'src/common/dto/common.dto';

export class GetPageDto extends QueryPageDto {
  @ApiProperty({ description: '文件夹', type: String, required: false })
  folderId: string;

  @ApiProperty({ description: '文件类型', type: String, required: false })
  // @IsString()
  fileType: string;

  @ApiProperty({ description: '状态', type: String, required: false })
  // @IsString()
  status: string;
}

export class ActionByCodeDot {
  @ApiProperty({ description: 'id', type: String, required: false })
  @IsOptional()
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
