import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { ConversionService, PermissionService, QueryService, RequestService } from '../../common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsEntity } from './entities/permissions.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PermissionsEntity])],
  controllers: [PermissionsController],
  providers: [PermissionsService, QueryService, RequestService, PermissionService, ConversionService],
})
export class PermissionsModule {}
