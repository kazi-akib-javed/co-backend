import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DtoValidationPipe } from "../../common";
import { CreateProgramDto } from "./dto/create-program.dto";
import { ProgramsService } from "./programs.service";

@ApiTags('Programs')
@Controller("programs")
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  //@ApiBearerAuth()
  @Post()
  create(
    @Body(DtoValidationPipe)
    createProgramDto: CreateProgramDto
  ): Promise<CreateProgramDto> {
    return this.programsService.create(createProgramDto);
  }

  //@ApiBearerAuth()
  @Get()
  findAll(): Promise<CreateProgramDto[]> {
    return this.programsService.findAll();
  }

  //@ApiBearerAuth()
  @Get('pagination')
  pagination(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ):Promise<CreateProgramDto[]>{
    return this.programsService.pagination(page,limit);
  }

  //@ApiBearerAuth()
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<CreateProgramDto> {
    return this.programsService.findOne(+id);
  }

  //@ApiBearerAuth()
  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body(DtoValidationPipe) dto: CreateProgramDto): Promise<CreateProgramDto> {
    return this.programsService.update(+id, dto);
  }

  //@ApiBearerAuth()
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number): Promise<CreateProgramDto> {
    return this.programsService.remove(+id);
  }
}
