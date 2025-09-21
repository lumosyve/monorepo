import { Test, TestingModule } from '@nestjs/testing';
import { CorpController } from './corp.controller';
import { CorpService } from './corp.service';

describe('CorpController', () => {
  let controller: CorpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorpController],
      providers: [CorpService],
    }).compile();

    controller = module.get<CorpController>(CorpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
