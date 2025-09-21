/*
 * @Author: ZhengJie
 * @Date: 2025-01-11 20:20:15
 * @LastEditTime: 2025-01-19 02:18:03
 * @Description: corp.module
 */
import { forwardRef, Module } from '@nestjs/common';
import { CorpService } from './corp.service';
import { CorpController } from './corp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corp } from './entities/corp.entity';
import { AuthModule } from '../auth/auth.module';

const EntityFeatures = TypeOrmModule.forFeature([Corp]);

@Module({
  imports: [EntityFeatures, forwardRef(() => AuthModule)],
  controllers: [CorpController],
  providers: [CorpService],
  exports: [CorpService],
})
export class CorpModule {}
