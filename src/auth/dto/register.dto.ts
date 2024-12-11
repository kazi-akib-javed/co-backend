import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { BaseDto } from "common";

export class RegisterDto extends BaseDto{
    @ApiProperty({ default: "Mahadia" })
    @IsString()
    firstName: string;

    @ApiProperty({ default: "Tabassum" })
    @IsString()
    lastName: string;

    @ApiProperty({ default: "aK@123456" })
    @IsString()
    password: string;

    @ApiProperty({ default: "mahadiatabassum161710@gmail.com" })
    @IsString()
    email: string;

    @ApiProperty({ default: "0170000001" })
    @IsString()
    phone: string;

    @ApiProperty({ default: "Jashore, Bangladesh" })
    @IsString()
    @IsOptional()
    address: string;
}