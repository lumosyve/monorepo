/*
 * @Author: ZhengJie
 * @Date: 2023-09-17 23:34:13
 * @Description: module.dictData
 */
import { Module, forwardRef } from '@nestjs/common';
import { DictDataService } from './dict-data.service';
import { DictDataController } from './dict-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DictDatum } from './entities/dict-datum.entity';
import { DictModule } from '../dict/dict.module';

const EntityFeatures = TypeOrmModule.forFeature([DictDatum]);

@Module({
  imports: [EntityFeatures, AuthModule, forwardRef(() => DictModule)],
  controllers: [DictDataController],
  providers: [DictDataService],
  exports: [DictDataService],
})
export class DictDataModule {}
