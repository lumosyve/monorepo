/*
 * @Author: ZhengJie
 * @Date: 2023-08-11 17:00:37
 * @Description: 全局通用dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class QueryPageDto {
  @ApiProperty({ description: '页数', required: false })
  pageNo: number;

  @ApiProperty({ description: '每页条数', required: false })
  pageSize: number;
}

export class CreateTokenDto {
  @ApiProperty({ description: 'token' })
  token: string;

  @ApiProperty({ description: 'token(Bearer)' })
  accessToken?: string;

  @ApiProperty({ description: '刷新token' })
  refreshToken?: string;
}

export class ActionByIdDot {
  @IsString()
  @ApiProperty({ description: 'id' })
  @IsNotEmpty({ message: '请检查Id' })
  id: string;
}
export class ActionByNumberIdDot {
  @IsNumber()
  @ApiProperty({ description: 'id' })
  @IsNotEmpty({ message: '请检查Id' })
  id: number;
}
