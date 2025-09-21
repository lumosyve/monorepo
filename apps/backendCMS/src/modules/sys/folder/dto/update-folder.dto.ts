/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 01:24:05
 * @LastEditTime: 2025-02-14 01:30:45
 * @Description: dto.update-folder
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFolderDto } from './create-folder.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFolderDto extends PartialType(CreateFolderDto) {
  @ApiProperty({ description: 'id', required: true })
  @IsString()
  @IsNotEmpty({ message: '请检查id' })
  id: string;
}
