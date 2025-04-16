import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import {
  BcryptService,
  QueryService,
  RedisService,
  SystemException,
  TokenService,
  UserResponseDto,
  UsersEntity,
} from "../../../common";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "../../users/users.service";
import { Repository } from "typeorm";
import { AuthDto } from "../dto/auth.dto";
import { RegisterDto } from "../dto/register.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthHelperService {
  private readonly logger = new Logger(AuthHelperService.name);
  access_token_ttl: number;
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly bcryptService: BcryptService,
    private readonly queryService: QueryService,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService
  ) {
    this.access_token_ttl = this.configService.get<number>('ACCESS_TOKEN_TTL');
  }
  generatePayload = async (
    userDto: CreateUserDto
  ): Promise<UserResponseDto> => {
    try {
      const userResponseDto = new UserResponseDto();
      userResponseDto.id = userDto.id;
      userResponseDto.userId = userDto?.userId;
      userResponseDto.firstName = userDto?.firstName;
      userResponseDto.lastName = userDto?.lastName;
      userResponseDto.email = userDto?.email;
      userResponseDto.role = userDto?.role?.name;
      return Promise.resolve(userResponseDto);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  registerHelper = async (registerDto: RegisterDto): Promise<RegisterDto> => {
    try {
      //const randomPassword = await this.otpService.randomPasswordGenerator();
      const user = await this.userService.findUserByEmail(registerDto.email);
      if (user) {
        throw new SystemException({
          status: HttpStatus.BAD_REQUEST,
          message: "User already exists!",
        });
      }
      registerDto.password = await this.bcryptService.hashPassword(
        registerDto.password
      );
      const res = await this.queryService.createData(
        registerDto,
        this.usersRepository
      );
      return res;
    } catch (error) {
      throw new SystemException(error);
    }
  };

  loginHeplper = async (authDto: AuthDto): Promise<UserResponseDto> => {
    try {
      const validateUser = await this.userService.validateUser(authDto);
      const payload = await this.generatePayload(validateUser);
      return await this.issueToken(payload);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  issueToken = async(_payload: UserResponseDto): Promise<UserResponseDto> => {
    try {
      //generate refresh token
      const refresh_token = await this.tokenService.generateRefreshToken(
        _payload
      );
      //update refresh token in DB
      const user = await this.userService.findOne(_payload?.id);
      user.refreshToken = refresh_token;
      await this.userService.updateUser(_payload?.id, user);

      const payload = await this.generatePayload(user);
      payload.refreshToken = refresh_token;
      //generate access token
      const access_token = await this.tokenService.generateAccessToken(payload);
      //set access token in payload
      payload.accessToken = access_token;
      //set sesstion in redis
      await this.redisService.set(access_token, JSON.stringify(payload), this.access_token_ttl);
      return payload;
    } catch (error) {
      throw new SystemException(error);
    }
  }
}
