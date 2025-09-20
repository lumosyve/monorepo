import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Lumosyve NestJS 后端服务已成功运行！';
  }
}