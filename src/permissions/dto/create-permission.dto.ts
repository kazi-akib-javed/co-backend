import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "common";
import { CreateRolesDto } from "../../roles/dto/create-roles.dto";

export class CreatePermissionDto extends BaseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Type(()=>CreateRolesDto)
    roles: CreateRolesDto[];
}
