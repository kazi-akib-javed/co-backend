import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware, LoggerMiddleware, RedisService, CsrfMiddleware, TokenService, PublicMiddleware } from '../common';
import { publicUrls } from './public.url';
import { configTypeorm } from '../common/database/typeorm.config';
import { configEnvironment } from '../common/env-config/env-config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { configRedis } from '../common/redis/redis.config';
import { ProgramsModule } from './programs/programs.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionsModule } from './role-permissions/role-permissins.module';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [configTypeorm(),configEnvironment(), configRedis(), AuthModule, UsersModule, RolesModule, PermissionsModule, RolePermissionsModule, ScraperModule, ProgramsModule],
  controllers: [AppController],
  providers: [AppService, RedisService, TokenService],
})
export class AppModule {
  constructor(){}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PublicMiddleware).forRoutes("*");
    consumer.apply(LoggerMiddleware).forRoutes("*");
    consumer
      .apply(AuthMiddleware)
      .exclude(...publicUrls).forRoutes("*");
    consumer.apply(CsrfMiddleware).exclude({path: '/auth/login', method: RequestMethod.POST}).forRoutes("*");
  }
}
