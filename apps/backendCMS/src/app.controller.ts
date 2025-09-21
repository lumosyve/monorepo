/*
 * @Author: ZhengJie
 * @Date: 2023-07-27 22:23:42
 * @Description: app.controller
 */
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnon } from './common/decorators/allow-anon.decorator';

@ApiTags('API前缀')
@Controller()
export class AppController {
  @Get()
  @AllowAnon()
  getHello(): string {
    return 'Welcome to Nestjs API';
  }
}
