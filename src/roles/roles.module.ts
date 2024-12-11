import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { ConversionService, QueryService, RequestService, ResponseService } from 'common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/roles.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RolesController],
  providers: [RolesService,QueryService,RequestService,ConversionService,ResponseService],
})
export class RolesModule {}
