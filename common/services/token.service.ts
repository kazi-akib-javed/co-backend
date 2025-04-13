import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserResponseDto } from "../../common/dtos/dto.config";
import { SystemException } from "../../common/exceptions/exceptions.config";
import * as jwt from "jsonwebtoken";
@Injectable()
export class TokenService {
    private logger: Logger = new Logger(TokenService.name);
    private privateKey: string;
    private refreshPrivateKey: string;
    private access_token_ttl_jwt: string;
    private refresh_token_ttl_jwt: string;
    constructor(
        private readonly configService: ConfigService,
    ){
      this.privateKey = this.configService
            .get("PRIVATE_KEY")
            .replace(/\\n/g, "\n");
      this.refreshPrivateKey = this.configService
            .get("REFRESH_PRIVATE_KEY")
            .replace(/\\n/g, "\n");
      this.access_token_ttl_jwt = this.configService.get<string>("ACCESS_TOKEN_TTL_JWT");
      this.refresh_token_ttl_jwt = this.configService.get<string>("REFRESH_TOKEN_TTL_JWT");
    }

    generateAccessToken = async (payload: UserResponseDto): Promise<string> => {
        try {
          let accessToken = jwt.sign({ ...payload }, this.privateKey, {
            expiresIn: this.access_token_ttl_jwt,
            algorithm: "RS256",
          });
          return Promise.resolve(accessToken);
        } catch (error) {
          throw new SystemException(error);
        }
      };
    
    generateRefreshToken = async (payload: UserResponseDto): Promise<string> => {
        try {
        let refreshToken = jwt.sign({ ...payload }, this.refreshPrivateKey, {
          expiresIn: this.refresh_token_ttl_jwt,
          algorithm: "RS256",
        });
        return Promise.resolve(refreshToken);
        } catch (error) {
          throw new SystemException(error);
        }
      }

    validateToken = async (token: string, publicKey: string): Promise<void> => {
      try {
        // Verify the JWT token
        const decodedToken = jwt.verify(token, publicKey, {
          algorithms: ["RS256"],
        }) as jwt.JwtPayload;
        this.logger.warn("Decoded Token: ", decodedToken);
      } catch (error) {
        throw new SystemException(error);
      }
    }

    parseCookies = (req: Request): Record<string, string> => {
        const cookieHeader = req.headers.get("cookie");
        if (!cookieHeader) {
          return {};
        }
        const cookies: Record<string, string> = {};
    
        if (cookieHeader) {
          cookieHeader.split(';').forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            cookies[key] = decodeURIComponent(value);
          });
        }
    
        return cookies;
      }
}