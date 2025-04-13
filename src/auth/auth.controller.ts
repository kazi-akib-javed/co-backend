import { Body, Controller, Post, Query, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DtoValidationPipe, TokenService } from "../../common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthHelperService } from "./helper/auth-helper.service";
import { AUTH_METHOD, GeneralAuthGateway } from "./helper/auth.gateway";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  private readonly refreshtokenTTL: number;
  constructor(
    private readonly authService: AuthService,
    private readonly authHelperService: AuthHelperService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    const generalAuthGateway = new GeneralAuthGateway(this.authHelperService);
    this.authService.registerAuthGateway(
      AUTH_METHOD.GENERAL,
      generalAuthGateway
    );
    this.refreshtokenTTL = this.configService.get<number>("REFRESH_TOKEN_TTL");
  }

  @Post("register")
  register(
    @Body(DtoValidationPipe)
    registerDto: RegisterDto,
    @Query("type") authMethod: AUTH_METHOD
  ) {
    return this.authService.register(registerDto, authMethod);
  }

  @Post("login")
  async login(
    @Body(DtoValidationPipe)
    authDto: AuthDto,
    @Query("authMethod") authMethod: AUTH_METHOD,
    @Res({ passthrough: true }) res: Response
  ) {
    const payload = await this.authService.login(authDto, authMethod);
    res.cookie("refresh_token", payload.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: this.refreshtokenTTL, // 7 days
    });
    return payload;
  }

  @Post("refresh-token")
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const cookies = this.tokenService.parseCookies(req);
    const refreshToken = cookies['refresh_token'];
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }
    const payload = await this.authService.rotateTokens(refreshToken);
    res.cookie("refresh_token", payload.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: this.refreshtokenTTL, // 7 days
    });
  }

  //@ApiBearerAuth()
  @Post("logout")
  logout() {
    return this.authService.logOut();
  }
}
