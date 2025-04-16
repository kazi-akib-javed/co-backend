import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "../entities/entities.config";
import { ProgramEntity } from "../../src/programs/entities/program.entity";
import { RoleEntity } from "../../src/roles/entities/roles.entity";
import { PermissionsEntity } from "../../src/permissions/entities/permissions.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_DB'),
        synchronize: configService.get<boolean>('DATABASE_SYNCRONIZE')&&true,
        autoLoadEntities: configService.get<boolean>('DATABASE_AUTOLOADENTITIES')&&true,
        logging: configService.get<boolean>('DATABASE_LOGGING')&&false,
        //ssl: {rejectUnauthorized: false},
        entities: [UsersEntity, ProgramEntity, RoleEntity, PermissionsEntity],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TypeormConfigModule {}