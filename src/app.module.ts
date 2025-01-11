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
import { RolePermissionsModule } from './role-permissions/role-permissins.module';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [configTypeorm(),configEnvironment(), configRedis(), AuthModule, UsersModule, RolesModule, PermissionsModule, RolePermissionsModule, ScraperModule, ProgramsModule],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {
  constructor(private readonly configService: ConfigService){}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
    consumer
      .apply(AuthMiddleware)
      .exclude(...publicUrls)
      .forRoutes("*");
      consumer.apply(CsrfMiddleware).exclude(...publicUrls).forRoutes('*');
  }
}
