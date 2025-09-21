/*
 * @Author: ZhengJie
 * @Date: 2023-08-09 01:06:59
 * @Description: auth.dto
 */
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ description: '租户' })
  @IsNotEmpty({ message: '请检查租户' })
  corpCode: string;

  @IsString()
  @ApiProperty({ description: '登录账号' })
  @IsNotEmpty({ message: '请检查登录账号' })
  loginCode: string;

  @IsString()
  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '请检查密码' })
  password: string;
}

export class WxLoginDto {
  // @IsString()
  @ApiProperty({ description: 'jscode' })
  // @IsNotEmpty({ message: '请检查code' })
  jsCode: string;

  // @IsString()
  @ApiProperty({ description: 'phoneCode' })
  // @IsNotEmpty({ message: '请检查code' })
  phoneCode: string;
}
