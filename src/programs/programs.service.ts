import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isActive, QueryService, SystemException } from '../../common';
import { Repository } from 'typeorm';
import { CreateProgramDto } from './dto/create-program.dto';
import { ProgramEntity } from './entities/program.entity';

@Injectable()
export class ProgramsService {
  constructor(
    private readonly queryService: QueryService,
    @InjectRepository(ProgramEntity)
    private readonly programRepository: Repository<ProgramEntity>
  ){}
  create = (createProgramDto: CreateProgramDto): Promise<CreateProgramDto> => {
    try {
      return this.queryService.createData(createProgramDto, this.programRepository);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  findAll = async (): Promise<CreateProgramDto[]> => {
    try {
      return this.queryService.findAll(this.programRepository, { ...isActive });
    } catch (error) {
      throw new SystemException(error);
    }
  }

  pagination = async(page: number, limit: number): Promise<CreateProgramDto[]> => {
    try {
      return this.queryService.pagination(this.programRepository,page,limit,{ ...isActive });
    } catch (error) {
      throw new SystemException(error);
    }
  }

  findOne = async (id: number):Promise<CreateProgramDto>=> {
    try {
      return await this.queryService.findOne(this.programRepository,{id: id, ...isActive });
    } catch (error) {
      throw new SystemException(error);
    }
  }

  update = async(id: number, dto: CreateProgramDto):Promise<CreateProgramDto>=> {
    try {
      return await this.queryService.update(dto,this.programRepository,{id: id, ...isActive });
    } catch (error) {
      throw new SystemException(error);
    }
  }

  remove = async(id: number):Promise<CreateProgramDto>=> {
    try {
      return await this.queryService.remove(this.programRepository,{ ...isActive });
    } catch (error) {
      throw new SystemException(error);
    }
  }
}
