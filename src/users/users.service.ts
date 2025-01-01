import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BcryptService,
  ConversionService,
  ExceptionService,
  isActive,
  PermissionService,
  QueryService,
  SystemException,
  UsersEntity,
} from '../../common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly conversionService: ConversionService,
    private readonly queryService: QueryService,
    private readonly permissionService: PermissionService,
    private readonly bcryptService: BcryptService
  ) {}

  findAll = async (): Promise<CreateUserDto[]> => {
    return await this.queryService.findAll(this.usersRepository);
  }

  //----------------------------------helpers------------------------------------
  findUserByEmail = async (
    emailOrUserName: string,
  ): Promise<CreateUserDto> => {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: emailOrUserName, ...isActive },
      });
      return await this.conversionService.toDto<UsersEntity, CreateUserDto>(
        user,
      );
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