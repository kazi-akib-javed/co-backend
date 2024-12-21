import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import {
  PermissionService,
  RedisService,
  SystemException,
  UserResponseDto,
} from "../../common";
import { AuthDto } from "./dto/auth.dto";
import { RegisterDto } from "./dto/register.dto";
import { AUTH_METHOD, AuthGateway } from "./helper/auth.gateway";
@Injectable()
export class AuthService {
  public authGateway: Record<string, AuthGateway> = {};
  constructor(
    private readonly redisService: RedisService,
    private readonly permissionService: PermissionService
  ) {}

  public registerAuthGateway = (
    authMethod: AUTH_METHOD,
    gateway: AuthGateway
  ) => {
    this.authGateway[authMethod] = gateway;
  };

  register = async (
    registerDto: RegisterDto,
    authMethod: AUTH_METHOD
  ): Promise<RegisterDto> => {
    try {
      const gateway = this.authGateway[authMethod];
      if (!gateway) {
        throw new Error(`Gateway not found for method: ${authMethod}`);
      }
      return await gateway.registerWith(registerDto);
    } catch (error) {
      console.error("Error during registration:", error);
      throw new SystemException(error.message);
    }
  };

  login = async (
    authDto: AuthDto,
    authMethod: AUTH_METHOD
  ): Promise<UserResponseDto> => {
    try {
      const gateway = this.authGateway[authMethod];
      if (!gateway) {
        throw new Error(`Gateway not found for method: ${authMethod}`);
      }
      return await gateway.loginWith(authDto);
    } catch (error) {
      console.error("Error during login:", error);
      throw new SystemException(error.message);
    }
  };

  loginOut = async (): Promise<any> => {
    try {
      const accessToken = await this.permissionService.returnRequest().accessToken;
      
      const payload = jwt.decode(accessToken) as any; // Decode token to get expiration time
      
      if (!payload || !payload.exp) {
        throw new Error("Invalid token payload.");
      }
      
      const ttl = payload.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await this.redisService.set(
          `blacklist:${accessToken}`,
          "blacklisted",
          ttl
        );
      }
      return { message: "Logout successful", success: true };
    } catch (error) {
      console.warn("Error during logout:", error);
    }
  };
}
