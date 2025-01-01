import { Injectable } from '@nestjs/common';
import { isActive, QueryService } from 'common';
import { CreateRolesDto } from './dto/create-roles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/roles.entity';
import { Repository } from 'typeorm';
import { UpdateRolesDto } from './dto/update-roles.dto';

@Injectable()
export class RolesService {
  constructor(private readonly queryService: QueryService,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ){}
  findAll = async (): Promise<CreateRolesDto[]> => {
    return await this.queryService.findAll(this.roleRepository,{...isActive});
  };

  create = async (dto: CreateRolesDto): Promise<CreateRolesDto> => {
    return await this.queryService.createData(dto,this.roleRepository);
  }
  
  findOne = async (id: number): Promise<CreateRolesDto> => {
    return await this.queryService.findOne(this.roleRepository,{id: id, ...isActive});
  }

  update = async(id: number, dto: CreateRolesDto): Promise<CreateRolesDto> => {
    return await this.queryService.update(dto,this.roleRepository,{id: id, ...isActive});
  }

  remove = async(id: number): Promise<CreateRolesDto> => {
    return await this.queryService.remove(this.roleRepository,{id: id, ...isActive});
  }
}
