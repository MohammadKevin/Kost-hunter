import { Test, TestingModule } from '@nestjs/testing';
import { KosService } from './kos.service';

describe('KosService', () => {
  let service: KosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KosService],
    }).compile();

    service = module.get<KosService>(KosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
