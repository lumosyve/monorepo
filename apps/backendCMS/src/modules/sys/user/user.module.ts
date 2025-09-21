/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: user.module
 */
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';

const EntityFeatures = TypeOrmModule.forFeature([User]);

@Module({
  imports: [EntityFeatures, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
