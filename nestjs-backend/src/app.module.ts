import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from 'src/config/handlers/catch-exception';
import { TransformationInterceptor } from 'src/config/handlers/response-success';
import { CheckRequestData } from './middleware/check-request.middleware';
import { CheckIdIsEmpty } from './middleware/check-id-empty.middleware';

const envModule = ConfigModule.forRoot({
  isGlobal: true,
});

import { PrismaModule } from './prisma/prisma.module';

// PERMISSION
import { AppLevelAccessModule } from './app-level-access/app-level-access.module';
import { PageLevelAccessModule } from './page-level-access/page-level-access.module';

// USER
import { AuthModule } from './auth/auth.module';
import { UserRoleModule } from './user-role/user-role.module';
import { SystemUserModule } from './system-user/system-user.module';

// GENERAL SETUP
import { RegionModule } from './region/region.module';
import { TownshipModule } from './township/township.module';
// import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';

@Module({
  imports: [
    envModule,
    PrismaModule,

    // PERMISSION
    AppLevelAccessModule,
    PageLevelAccessModule,

    // USER
    AuthModule,
    UserRoleModule,
    SystemUserModule,

    // GENERAL
    RegionModule,
    TownshipModule,

    // SETUP FCM
    //FirebaseAdminModule,

    // NOTIFICATION
    //CloudMessageModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformationInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckRequestData).forRoutes({
      path: '*',
      method: RequestMethod.POST,
    });
    consumer.apply(CheckRequestData).forRoutes({
      path: '*',
      method: RequestMethod.PATCH,
    });
    consumer.apply(CheckIdIsEmpty).forRoutes({
      // if ID is empty remove ID
      path: '*',
      method: RequestMethod.POST,
    });
  }
}