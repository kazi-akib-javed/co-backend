import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BcryptService,
  ConversionService, isActive, QueryService,
  SystemException,
  UsersEntity
} from '../../common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly queryService: QueryService,
    private readonly bcryptService: BcryptService
  ) {}

  findAll = async (): Promise<CreateUserDto[]> => {
    return await this.queryService.findAll(this.usersRepository);
  }

  findOne = async (id: number): Promise<CreateUserDto> => {
    try {
      return await this.queryService.findOne<CreateUserDto, UsersEntity>(this.usersRepository, { id: id });
    } catch (error) {
      throw new SystemException(error);
    }
  };

  updateUser = async (
    id: number,
    dto: CreateUserDto | any,
  ): Promise<CreateUserDto> => {
    try {
      return await this.queryService.update(dto,this.usersRepository,{id: id});
    } catch (error) {
      throw new SystemException(error);
    }
  };

  findUserByEmail = async (
    emailOrUserName: string,
  ): Promise<CreateUserDto> => {
    try {
      return await this.queryService.findOne<CreateUserDto, UsersEntity>(this.usersRepository,{ email: emailOrUserName});
    } catch (error) {
      throw new SystemException(error);
    }
  };

  validateUser = async (authDto: AuthDto): Promise<CreateUserDto> => {
    try {
      const user = await this.queryService.findOne<CreateUserDto, UsersEntity>(this.usersRepository, { email: authDto?.email, ...isActive }, ['role']);
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
}