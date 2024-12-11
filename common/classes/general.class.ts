import { BaseDto } from "common/dtos/dto.config";
import { QueryService } from "common/services/query.service";

export class GeneralClass<T=QueryService> {
    constructor(private readonly queryService: T){}
    findAll = () =>{
        return
    }
}