import { Module } from "@nestjs/common";
import {
  BcryptService,
  ConversionService,
  ExceptionService,
  PermissionService,
  QueryService,
  RedisService,
  RequestService,
  TokenService,
  UsersEntity,
} from "../../common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthHelperService } from "./helper/auth-helper.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "../users/users.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
@Module({
  imports: [PassportModule, JwtModule.register({}), TypeOrmModule.forFeature([UsersEntity])],
  controllers: [AuthController],
  providers: [
    AuthService,
    QueryService,
    RedisService,
    PermissionService,
    BcryptService,
    AuthHelperService,
    ConversionService,
    RequestService,
    UsersService,
    ExceptionService,
    TokenService
  ],
})
export class AuthModule {}
