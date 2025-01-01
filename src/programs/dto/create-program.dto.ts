import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BaseDto } from "common";
import { ProgramsInterface } from "../interface/programs.interface";

export class CreateProgramDto extends BaseDto implements ProgramsInterface {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    university: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    location: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    degreeType: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    subject: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    requiredDegree: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    tuitionFee: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    requiredGpa: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    englishLanguageTestScore: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    germanLanguageTestScore: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    greScore: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    admissionType: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    admissionSession: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    courseWebsite: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    applyVia: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    languageOfStudy: string;

    @ApiProperty()
    @IsOptional()
    @IsDate({message: "appStartDateSummer type error"})
    @Type(() => Date)
    appStartDateSummer: Date;

    @ApiProperty()
    @IsOptional()
    @IsDate({message: "appStartDateWinter type error"})
    @Type(() => Date)
    appStartDateWinter: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate({message: "appEndDateSummer type error"})
    @Type(() => Date)
    appEndDateSummer: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate({message: "appEndDateWinter type error"})
    @Type(() => Date)
    appEndDateWinter: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    programDuration: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    ects: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    selectionProcedure: string;

}
