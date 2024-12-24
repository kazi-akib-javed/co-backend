import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRolesDto } from "./dto/create-roles.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DtoValidationPipe } from "common";

@ApiTags("Roles")
@Controller("role")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @ApiBearerAuth()
  @Get()
  findAll(): Promise<CreateRolesDto[]> {
    return this.rolesService.findAll();
  }

  @ApiBearerAuth()
  @Post()
  create(
    @Body(DtoValidationPipe)
    createRoleDto: CreateRolesDto
  ): Promise<CreateRolesDto> {
    return this.rolesService.create(createRoleDto);
  }

  @ApiBearerAuth()
  @Get(":id")
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CreateRolesDto> {
    return this.rolesService.findOne(id);
  }

  @ApiBearerAuth()
  @Put(":id")
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(DtoValidationPipe) dto: CreateRolesDto
  ): Promise<CreateRolesDto> {
    return this.rolesService.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(":id")
  remove(@Param('id', ParseIntPipe) id: number): Promise<CreateRolesDto> {
    return this.rolesService.remove(id);
  }
}
