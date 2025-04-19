import { Inject, NotFoundException } from '@nestjs/common';
import { BaseDto } from '../../common/dtos/core/base.dto';
import { CustomBaseEntity } from '../../common/entities/custom-base.entity';
import { SystemException } from '../../common/exceptions/system.exception';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ConversionService } from './conversion.service';
import { RequestService } from './request.service';
import e from 'express';

interface Options {
    [field: string]: any;
}

export class QueryService {
    constructor(
        @Inject(RequestService)
        private readonly requestService: RequestService,
        @Inject(ConversionService)
        private readonly conversionService: ConversionService,

    ) { }
    //Here options is postchange data operation
    async createData<D extends BaseDto, E extends CustomBaseEntity, K extends Options>(dto: D, repository: Repository<E>, options?: K): Promise<D> {
        try {
            const forCreateDto = this.requestService.forCreate(dto);
            const dtoToEntity = await this.conversionService.toEntity<E, D>(forCreateDto);
            if (options) {
                Object.entries(options).forEach(([field, value]) => {
                    dtoToEntity[field] = value;
                });
            }
            const createEntity = repository.create(dtoToEntity);
            const save = await repository.save(createEntity);
            const res = await this.conversionService.toDto<E, D>(save);
            return res;
        } catch (error) {
            throw new SystemException(error);
        }
    }

    async findAll<D extends BaseDto, E extends CustomBaseEntity>(repository: Repository<E>, options?: FindOptionsWhere<E>, relations?: string[]): Promise<D[]> {
        try {
            const allEntries = await repository.find({ where: [options], relations: relations });
            const res = await this.conversionService.toDtos<E, D>(allEntries);
            return res;
        } catch (error) {
            throw new SystemException(error);
        }
    }

    async pagination<D extends BaseDto, E extends CustomBaseEntity>(repository: Repository<E>, page: number, limit: number, options?: FindOptionsWhere<E>, relations?: string[]): Promise<[D[], Number]>{
        try {
            const entries = await repository.find({where:[options], relations: relations, skip: (page-1)*limit, take: limit});
            const total = await repository.count({where:[options]});
            const res = await this.conversionService.toPagination<E, D>([entries, total]);
            return [res[0], total];
        } catch (error) {
            throw new SystemException(error);
        }
    }


    async findOne<D extends BaseDto, E extends CustomBaseEntity>(repository: Repository<E>, options?: FindOptionsWhere<E>, relations?: string[]): Promise<D> {
        try {
            const entry = await repository.findOne({where:[options], relations: relations});
            const res = await this.conversionService.toDto<E,D>(entry);
            if(!res){
                throw new NotFoundException();
            }
            return res;
        } catch (error) {
            throw new SystemException(error);
        }
    }

    async update<D extends BaseDto, E extends CustomBaseEntity>(dto: D, repository: Repository<E>, options?: FindOptionsWhere<E>): Promise<D> {
        try {
            const updateDto = this.requestService.forUpdate(dto);
            const savedData = await this.findOne(repository,options); //await repository.findOne({where: [options]});
            const dtoToEntity = await this.conversionService.toEntity<E,D>({...savedData, ...updateDto});
            const updateData = await repository.save(dtoToEntity,{reload: true});
            return this.conversionService.toDto<E,D>(updateData);
        } catch (error) {
            throw new SystemException(error);
        }
    }
    
    async remove<D extends BaseDto, E extends CustomBaseEntity>(repository: Repository<E>, options: FindOptionsWhere<E>): Promise<D> {
        let savedData = await this.findOne(repository,options);
        savedData.isActive = 0;//to inactive the data
        const updateData = await repository.save(savedData as E);
        return this.conversionService.toDto<E,D>(updateData);
    }
}