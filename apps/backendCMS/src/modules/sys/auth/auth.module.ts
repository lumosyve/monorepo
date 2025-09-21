/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 15:13:08
 * @Description: 权限管理
 */
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { CorpModule } from '../corp/corp.module';

const JwtModuleImport = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    secret: config.get('jwt.secretkey'),
    signOptions: {
      expiresIn: config.get('jwt.expiresin'),
    },
  }),
});

@Module({
  // imports: [JwtModuleImport, TenantEntityFeatures, UserEntityFeatures],
  imports: [
    JwtModuleImport,
    forwardRef(() => UserModule),
    forwardRef(() => CorpModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
