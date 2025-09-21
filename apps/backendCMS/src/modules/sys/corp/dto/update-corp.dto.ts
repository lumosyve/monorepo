/*
 * @Author: ZhengJie
 * @Date: 2025-01-11 20:20:15
 * @LastEditTime: 2025-01-19 01:19:07
 * @Description: update-corp.dto
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCorpDto } from './create-corp.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCorpDto extends PartialType(CreateCorpDto) {
  @ApiProperty({ description: 'id', required: true })
  @IsString()
  @IsNotEmpty({ message: '请检查id' })
  id: string;
}
