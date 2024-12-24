import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import {
  BcryptService,
  QueryService,
  RedisService,
  SystemException,
  UserResponseDto,
  UsersEntity,
} from "common";
import { CreateUserDto } from "../../users/dto/create-user.dto";

import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "../../users/users.service";
import { Repository } from "typeorm";
import { AuthDto } from "../dto/auth.dto";
import { RegisterDto } from "../dto/register.dto";

@Injectable()
export class AuthHelperService {
  private readonly logger = new Logger(AuthHelperService.name);
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly bcryptService: BcryptService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly queryService: QueryService,
    private readonly userService: UsersService
  ) {}
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
      if(user){
        throw new SystemException({status: HttpStatus.BAD_REQUEST, message: 'User already exists!'});
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
      const accessToken = await this.generateToken(payload);
      payload.accessToken = accessToken;
      //set sesstion in redis
      await this.redisService.set(accessToken, JSON.stringify(payload), 3600);
      payload.accessToken = accessToken;
      return Promise.resolve(payload);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  generateToken = async (payload: UserResponseDto): Promise<string> => {
    try {
      const privateKEY = this.configService
        .get("PRIVATE_KEY")
        .replace(/\\n/g, "\n");

      let accessToken = jwt.sign({ ...payload }, privateKEY, {
        expiresIn: "365d",
        algorithm: "RS256",
      });

      this.logger.log("access token: " + accessToken);
      return Promise.resolve(accessToken);
    } catch (error) {
      throw new SystemException(error);
    }
  };
}
