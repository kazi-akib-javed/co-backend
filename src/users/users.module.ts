import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService, ConversionService, ExceptionService, PermissionService, QueryService, RequestService, ResponseService, UsersEntity } from 'common';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [UsersService, RequestService, ConversionService, ResponseService, ExceptionService, BcryptService, PermissionService, QueryService],
})
export class UsersModule {}
