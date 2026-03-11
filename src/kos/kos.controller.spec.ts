import { Test, TestingModule } from '@nestjs/testing';
import { KosController } from './kos.controller';

describe('KosController', () => {
  let controller: KosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KosController],
    }).compile();

    controller = module.get<KosController>(KosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
