/*
 * @Author: ZhengJie
 * @Date: 2023-07-28 14:31:29
 * @Description: middleware.login
 */
import {
  forwardRef,
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from 'src/modules/cache/cache.service';
import { AuthService } from 'src/modules/sys/auth/auth.service';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    const WHITE_LIST = this.configService.get('common.whiteList');
    const isPassLogin = WHITE_LIST.some((item) => req.url.includes(item));
    if (isPassLogin) {
      next();
      return;
    }
    const isPermission = await this.configService.get('app.permission');
    const authorization = req.headers.authorization;

    if (
      isPermission &&
      (!authorization || authorization.split('Bearer ').length < 2)
    ) {
      throw new UnauthorizedException('请先登录');
    }

    // 解token
    const { status, data, msg } = await this.authService.validToken(
      authorization.replace('Bearer ', ''),
    );
    if (status === 200) {
      // redis查询是否存在有效登录
      const cacheData = await this.cacheService.get(
        `user_${data.id}_${data.userName}`,
      );
      if (!cacheData) {
        throw new UnauthorizedException('请先登录');
      }
    } else {
      throw new UnauthorizedException(msg);
    }
    next();
  }
}
