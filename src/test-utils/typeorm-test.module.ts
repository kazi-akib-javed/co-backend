// src/test-utils/typeorm-test.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersEntity } from '../../common';
import { ProgramEntity } from '../programs/entities/program.entity';
import { PermissionsEntity } from '../permissions/entities/permissions.entity';
import { RoleEntity } from '../roles/entities/roles.entity';


export const TypeOrmTestModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: 'env/.env.dev' })],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: +configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_DB_TEST'),
    synchronize: configService.get<boolean>('DATABASE_SYNCRONIZE') || true,
    autoLoadEntities: configService.get<boolean>('DATABASE_AUTOLOADENTITIES') || true,
    logging: false,
    entities: [UsersEntity, ProgramEntity ,PermissionsEntity, RoleEntity], // add your test entities
  }),
  inject: [ConfigService],
});
