import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { KosModule } from './kos/kos.module';
import { ReviewModule } from './review/review.module';
import { BookModule } from './book/book.module';
import { FacilitiesModule } from './facility/facility.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
    KosModule,
    ReviewModule,
    BookModule,
    FacilitiesModule,
  ],
})
export class AppModule {}
