import { DatabaseModule } from '@config/database/database.module';
import { JwtAuthGuard } from '@guards';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule, UserModule } from '@resources';
import { AppService } from '../app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    DatabaseModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: seconds(60),
          limit: 10,
        },
      ],
      errorMessage: 'Too many requests. Please try again later.',
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: StatusGuard,
    // },
  ],
})
export class AppModule {}
