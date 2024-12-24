import {
  Body,
  Controller,
  Post,
  Query,
  UseInterceptors
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags
} from "@nestjs/swagger";
import { DtoValidationPipe, SystemException } from "common";
import { CsrfTokenInterceptor } from "common/interceptors/csrf.interceptor";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthHelperService } from "./helper/auth-helper.service";
import { AUTH_METHOD, GeneralAuthGateway } from "./helper/auth.gateway";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authHelperService: AuthHelperService
  ) {
    const generalAuthGateway = new GeneralAuthGateway(this.authHelperService);
    this.authService.registerAuthGateway(
      AUTH_METHOD.GENERAL,
      generalAuthGateway
    );
  }

  @Post("register")
  register(
    @Body(DtoValidationPipe)
    registerDto: RegisterDto,
    @Query("type") authMethod: AUTH_METHOD
  ) {
    try {
      return this.authService.register(registerDto, authMethod);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  @UseInterceptors(CsrfTokenInterceptor)
  @Post("login")
  login(
    @Body(
      new DtoValidationPipe()
    )
    authDto: AuthDto,
    @Query("authMethod") authMethod: AUTH_METHOD
  ) {
    return this.authService.login(authDto, authMethod);
  }

  @ApiBearerAuth()
  @Post("logout")
  logout() {
    return this.authService.loginOut();
  }
}
