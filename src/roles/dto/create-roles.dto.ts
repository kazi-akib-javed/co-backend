import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "common";
import { CreatePermissionDto } from "../../permissions/dto/create-permission.dto";

export class CreateRolesDto extends BaseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Type(()=>CreatePermissionDto)
    permissions: CreatePermissionDto[];
}
