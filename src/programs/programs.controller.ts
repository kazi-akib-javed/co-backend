import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { ProgramsService } from "./programs.service";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DtoValidationPipe } from "common";

@ApiTags('Programs')
@Controller("programs")
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @ApiBearerAuth()
  @Post()
  create(
    @Body(DtoValidationPipe)
    createProgramDto: CreateProgramDto
  ): Promise<CreateProgramDto> {
    return this.programsService.create(createProgramDto);
  }

  @ApiBearerAuth()
  @Get()
  findAll(): Promise<CreateProgramDto[]> {
    return this.programsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.programsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body(DtoValidationPipe) updateProgramDto: UpdateProgramDto) {
    return this.programsService.update(+id, updateProgramDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.programsService.remove(+id);
  }
}
