import { Module } from "@nestjs/common";
import {
  BcryptService,
  ConversionService,
  ExceptionService,
  PermissionService,
  QueryService,
  RedisService,
  RequestService,
  UsersEntity,
} from "../../common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthHelperService } from "./helper/auth-helper.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "../users/users.service";
import { CsrfService } from "common/services/csrf.service";
@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
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
    CsrfService
  ],
})
export class AuthModule {}
