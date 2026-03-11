import { Module } from '@nestjs/common';
import { KosService } from './kos.service';
import { KosController } from './kos.controller';

@Module({
  controllers: [KosController],
  providers: [KosService],
})
export class KosModule {}
