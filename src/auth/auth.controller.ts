import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { RegisterDto } from "./dto/register.dto";
import { DtoValidationPipe } from "common";
import { CsrfTokenInterceptor } from "common/interceptors/csrf.interceptor";
import { AUTH_METHOD, GeneralAuthGateway } from "./helper/auth.gateway";
import { AuthHelperService } from "./helper/auth-helper.service";

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

  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: "Registration is successful",
  })
  @HttpCode(HttpStatus.OK)
  @Post("register")
  register(
    @Body(
      new DtoValidationPipe({
        skipMissingProperties: false,
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    )
    registerDto: RegisterDto,
    @Query("authMethod") authMethod: AUTH_METHOD
  ) {
    return this.authService.register(registerDto, authMethod);
  }

  @ApiOperation({
    summary: "User login",
    description: "Allows a user to log in using their credentials.",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string", example: "mahadiatabassum161710@gmail.com" },
        password: { type: "string", example: "aK@123456" },
      },
    },
  })
  @ApiCreatedResponse({
    status: 200,
    description:
      "Login is successful. Returns the user details and access token.",
    schema: {
      type: "object",
      properties: {
        nonce: { type: "number", example: 1733689424340 },
        status: { type: "number", example: 200 },
        message: { type: "string", example: "Successful!" },
        error: { type: "string", nullable: true, example: null },
        payload: {
          type: "object",
          properties: {
            count: { type: "number", example: 1 },
            data: {
              type: "object",
              properties: {
                id: { type: "number", example: 2 },
                firstName: { type: "string", example: "Mahadia" },
                lastName: { type: "string", example: "Tabassum" },
                email: {
                  type: "string",
                  example: "mahadiatabassum161710@gmail.com",
                },
                role: { type: "string", example: "Admin" },
                accessToken: {
                  type: "string",
                  example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "The user and password combination is invalid.",
    schema: {
      type: "object",
      properties: {
        nonce: { type: "number", example: 1733689761767 },
        status: { type: "number", example: 400 },
        message: { type: "string", example: "User and password is not valid" },
        error: {
          type: "object",
          properties: {
            fields: { type: "string", nullable: true, example: null },
            system: {
              type: "object",
              properties: {
                domain: { type: "string", example: "System Error" },
                value: { type: "string", example: "ERROR" },
                message: {
                  type: "string",
                  example: "User and password is not valid",
                },
              },
            },
          },
        },
        payload: { type: "string", nullable: true, example: null },
      },
    },
  })
  @UseInterceptors(CsrfTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(
    @Body(
      new DtoValidationPipe({
        skipMissingProperties: false,
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    )
    authDto: AuthDto,
    @Query("authMethod") authMethod: AUTH_METHOD
  ) {
    return this.authService.login(authDto, authMethod);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: "Logout is successful",
  })
  @HttpCode(HttpStatus.OK)
  @Post("logout")
  logout() {
    return this.authService.loginOut();
  }
}
