import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware, ResponseInterceptor, LoggerMiddleware, RedisService, CsrfMiddleware, PayloadInterceptor, CsrfTokenInterceptor } from '../common';
import { publicUrls } from './public.url';
import { configTypeorm } from 'common/database/typeorm.config';
import { configEnvironment } from 'common/env-config/env-config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { configRedis } from 'common/redis/redis.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProgramsModule } from './programs/programs.module';
import { RolesModule } from './roles/roles.module';
import { ConfigService } from '@nestjs/config';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [configTypeorm(),configEnvironment(), configRedis(), AuthModule, UsersModule, ProgramsModule, RolesModule, PermissionsModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PayloadInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CsrfTokenInterceptor
    },
    RedisService
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService){}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
    consumer
      .apply(AuthMiddleware)
      .exclude(...publicUrls)
      .forRoutes("*");
      if(this.configService.get<string>('NODE_ENV')==='prod')
      consumer.apply(CsrfMiddleware).exclude('/auth/login').forRoutes('*');
  }
}
