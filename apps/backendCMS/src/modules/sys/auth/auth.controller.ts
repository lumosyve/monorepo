/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 15:13:08
 * @Description: 权限管理
 */
import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto, WxLoginDto } from './dto/auth.dto';
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator';

@Controller('/sys/auth')
@ApiTags('权限管理')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @AllowAnon()
  login(@Body() loginParams: LoginDto) {
    return this.authService.login(loginParams);
  }

  @Post('wxLogin')
  @ApiOperation({ summary: '微信登录' })
  @AllowAnon()
  wxLogin(@Body() loginParams: WxLoginDto) {
    return this.authService.wxLogin(loginParams);
  }

  @Get('logout')
  @ApiOperation({ summary: '登出' })
  logout(@Headers() headers: Record<string, string>) {
    return this.authService.logout(headers['authorization']);
  }

  @Get('info')
  @ApiOperation({ summary: '获取当前登录用户信息' })
  getInfo(@Headers() headers: Record<string, string>) {
    return this.authService.getInfo(headers.authorization);
  }

  // @Get('token')
  // @ApiOperation({ summary: '刷新token' })
  // refreshToken(@Headers() headers: Record<string, string>) {
  //   return this.authService.refreshToken(headers.authorization);
  // }
}
