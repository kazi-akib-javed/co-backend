import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { isActive, QueryService, SystemException } from '../../common';
import { Repository } from 'typeorm';
import { PermissionsEntity } from './entities/permissions.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionsEntity)
    private readonly permissionsEntityRepository: Repository<PermissionsEntity>,
    private readonly queryService: QueryService
  ){}
  create = async(createPermissionDto: CreatePermissionDto):Promise<CreatePermissionDto> => {
    try {
      return await this.queryService.createData(createPermissionDto,this.permissionsEntityRepository);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  findAll = async():Promise<CreatePermissionDto[]>=> {
    try {
      return await this.queryService.findAll(this.permissionsEntityRepository, {...isActive});
    } catch (error) {
      throw new SystemException(error);
    }
  }

  findOne = async (id: number):Promise<CreatePermissionDto>=> {
    try {
      return await this.queryService.findOne(this.permissionsEntityRepository,{id: id, ...isActive})
    } catch (error) {
      throw new SystemException(error);
    }
  }

  update = async(id: number, dto: CreatePermissionDto):Promise<CreatePermissionDto>=> {
    try {
      return await this.queryService.update(dto,this.permissionsEntityRepository,{id: id, ...isActive})
    } catch (error) {
      throw new SystemException(error);
    }
  }

  remove = async(id: number):Promise<CreatePermissionDto>=> {
    try {
      return await this.queryService.remove(this.permissionsEntityRepository,{id: id, ...isActive});
    } catch (error) {
      throw new SystemException(error);
    }
  }
}
