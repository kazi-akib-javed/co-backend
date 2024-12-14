import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConversionService,
  ExceptionService,
  PermissionService,
  QueryService,
  SystemException,
  UsersEntity,
} from '../../common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly exceptionService: ExceptionService,
    private readonly conversionService: ConversionService,
    private readonly queryService: QueryService,
    private readonly permissionService: PermissionService,
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
        where: { email: emailOrUserName },
      });
      this.exceptionService.notFound(
        user,
        'User is not found by phone or email',
      );

      return await this.conversionService.toDto<UsersEntity, CreateUserDto>(
        user,
      );
    } catch (error) {
      throw new SystemException(error.message);
    }
  };
}