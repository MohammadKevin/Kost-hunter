import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { KosModule } from './kos/kos.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';
import { ReportModule } from './report/report.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    KosModule,
    FacilitiesModule,
    ReviewModule,
    BookingModule,
    ReportModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
