import { Injectable } from "@nestjs/common";
import {
  PermissionService,
  RedisService,
  SystemException,
  TokenService,
  UserResponseDto,
  UsersEntity,
} from "../../common";
import { AuthDto } from "./dto/auth.dto";
import { RegisterDto } from "./dto/register.dto";
import { AUTH_METHOD, AuthGateway } from "./helper/auth.gateway";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { AuthHelperService } from "./helper/auth-helper.service";
@Injectable()
export class AuthService {
  public authGateway: Record<string, AuthGateway> = {};

  private refreshPublicKey: string;

  constructor(
    private readonly redisService: RedisService,
    private readonly permissionService: PermissionService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly authHelperService: AuthHelperService,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>
  ) {
    this.refreshPublicKey = this.configService
      .get("REFRESH_PUBLIC_KEY")
      .replace(/\\n/g, "\n");
  }

  public registerAuthGateway = (
    authMethod: AUTH_METHOD,
    gateway: AuthGateway
  ) => {
    this.authGateway[authMethod] = gateway;
  };

  register = async (
    registerDto: RegisterDto,
    authMethod: AUTH_METHOD
  ): Promise<UserResponseDto> => {
    try {
      const gateway = this.authGateway[authMethod];
      if (!gateway) {
        throw new Error(`Gateway not found for method: ${authMethod}`);
      }
      return await gateway.registerWith(registerDto);
    } catch (error) {
      throw new SystemException(error);
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
      throw new SystemException(error.message);
    }
  };

  logOut = async (): Promise<any> => {
    try {
      const payload = this.permissionService.returnRequest();

      await this.usersRepository.update(payload.id, { refreshToken: "" });

      await this.redisService.delete(payload.accessToken);

      return { message: "Logout successful", success: true };
    } catch (error) {
      throw new SystemException(error);
    }
  };

  async rotateTokens(refreshToken: string): Promise<UserResponseDto> {
    try {
      await this.tokenService.validateToken(
        refreshToken,
        this.refreshPublicKey
      );
      const payload = await this.redisService.get(refreshToken);
      return await this.authHelperService.issueToken(JSON.parse(payload));
    } catch (error) {
      throw new SystemException(error);
    }
  }
}
