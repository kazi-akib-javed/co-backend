import { Injectable } from '@nestjs/common';
import { isActive, QueryService } from '../../common';
import { CreateRolesDto } from './dto/create-roles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(private readonly queryService: QueryService,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ){}
  async findAll(): Promise<CreateRolesDto[]> {
    return await this.queryService.findAll(this.roleRepository,{...isActive});
  };

  async create (dto: CreateRolesDto): Promise<CreateRolesDto> {
    return await this.queryService.createData(dto,this.roleRepository);
  }
  
  async findOne(id: number): Promise<CreateRolesDto> {
    return await this.queryService.findOne(this.roleRepository,{id: id, ...isActive});
  }

  async update(id: number, dto: CreateRolesDto): Promise<CreateRolesDto> {
    return await this.queryService.update(dto,this.roleRepository,{id: id, ...isActive});
  }

  async remove(id: number): Promise<CreateRolesDto> {
    return await this.queryService.remove(this.roleRepository,{id: id, ...isActive});
  }
}
