import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  BcryptService,
  ConversionService,
  ExceptionService,
  OtpService,
  PermissionService,
  QueryService,
  RedisService,
  RequestService,
  ResponseService,
  UsersEntity,
} from "../../common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import Redis from "ioredis";

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [AuthController],
  providers: [
    AuthService,
    ExceptionService,
    RequestService,
    ConversionService,
    ResponseService,
    BcryptService,
    ConfigService,
    PermissionService,
    UsersService,
    QueryService,
    OtpService,
    RedisService
  ],
})
export class AuthModule {}
