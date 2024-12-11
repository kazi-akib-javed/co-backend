import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import {
  BcryptService,
  PermissionService,
  QueryService,
  RedisService,
  SystemException,
  UserResponseDto,
  UsersEntity
} from '../../common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly bcryptService: BcryptService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly permissionService: PermissionService,
    private readonly queryService: QueryService,
  ) { }

  register = async (registerDto: RegisterDto): Promise<RegisterDto> => {
    try {
      return await this.registerHelper(registerDto);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  login = async (authDto: AuthDto): Promise<UserResponseDto> => {
    try {
      return await this.loginHeplper(authDto);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  loginOut = async (): Promise<any> => {
    try {
      const accessToken = await this.permissionService.returnRequest()['accessToken'];
      const res = await this.redisService.delete(accessToken);
      return res;
    } catch (error) {
      console.warn(error);
    }
  }

  //------------------------helper------------------------
  registerHelper = async (registerDto: RegisterDto): Promise<RegisterDto> => {
    try {
      //const randomPassword = await this.otpService.randomPasswordGenerator();
      registerDto.password = await this.bcryptService.hashPassword(registerDto.password);
      const res = await this.queryService.createData(registerDto, this.usersRepository);
      return res;
    } catch (error) {
      throw new SystemException(error);
    }
  }

  loginHeplper = async (authDto: AuthDto): Promise<UserResponseDto> => {
    try {
      const validateUser = await this.validateUser(authDto);
      const payload = await this.generatePayload(validateUser);
      const accessToken = await this.generateToken(payload);
      //set sesstion in redis
      await this.redisService.set(accessToken,JSON.stringify(payload),3600);
      payload.accessToken = accessToken;
      return Promise.resolve(payload);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  validateUser = async (authDto: AuthDto): Promise<CreateUserDto> => {
    try {
      const user = await this.queryService.findOne<CreateUserDto, UsersEntity>(this.usersRepository, { email: authDto?.email }, ['role']);
      if (!user) {
        throw new SystemException({
          status: HttpStatus.BAD_REQUEST,
          message: "Wrong credentials!"
        })
      }
      const isPasswordMatched = await this.bcryptService.comparePassword(
        authDto.password,
        user?.password,
      );
      if (!isPasswordMatched) {
        throw new SystemException({
          status: HttpStatus.BAD_REQUEST,
          message: "User and password is not valid",
        });
      }
      return user;
    } catch (error) {
      throw new SystemException(error);
    }
  }

  generatePayload = async (userDto: CreateUserDto): Promise<UserResponseDto> => {
    const userResponseDto = new UserResponseDto();
    userResponseDto.id = userDto.id;
    userResponseDto.userId = userDto?.userId;
    userResponseDto.firstName = userDto?.firstName;
    userResponseDto.lastName = userDto?.lastName;
    userResponseDto.email = userDto?.email;
    userResponseDto.role = userDto?.role?.name;
    return Promise.resolve(userResponseDto);
  }

  generateToken = async (payload: UserResponseDto): Promise<string> => {
    const privateKEY = this.configService
      .get('PRIVATE_KEY')
      .replace(/\\n/g, '\n');

    let accessToken = jwt.sign({ ...payload }, privateKEY, {
      expiresIn: '365d',
      algorithm: 'RS256',
    });

    this.logger.log('access token: ' + accessToken);
    return Promise.resolve(accessToken);
  }
}