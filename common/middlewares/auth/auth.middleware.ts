import { HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response } from "express";
import { ErrorDto } from "../../dtos/response/error.dto";
import { ResponseDto } from "../../dtos/response/response.dto";
import { SystemErrorDto } from "../../dtos/response/system-error.dto";
import { RedisService } from "../../../common/services/redis.service";
import { TokenService } from "../../../common/services/token.service";
import { SystemException } from "common/exceptions/system.exception";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);
  private accessToken: string = "";
  private publicKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService
  ) {
    // Initialize public keys and refresh public keys
    this.publicKey = this.configService
      .get<string>("PUBLIC_KEY")
      ?.replace(/\\n/g, "\n");
  }

  private static toResponse(res: Response, message: string): Response {
    const systemErrorDto = new SystemErrorDto("UNAUTHORIZED", "Error", message);
    const errorDto = new ErrorDto(null, systemErrorDto);

    const responseDto = new ResponseDto(
      new Date().getTime(),
      HttpStatus.UNAUTHORIZED,
      message,
      errorDto,
      null
    );
    throw new SystemException(responseDto);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      this.accessToken = req.headers["authorization"]?.split("Bearer ")[1];
      // Verify the JWT token
      await this.tokenService.validateToken(this.accessToken, this.publicKey);

      next();
    } catch (error) {
      return AuthMiddleware.toResponse(
        res,
        "Authorization is denied!! Please login again!!"
      );
    }
  }
}
