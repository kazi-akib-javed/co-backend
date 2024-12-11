import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRolesDto } from "./dto/create-roles.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DtoValidationPipe, IntValidationPipe } from "common";

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
    @Body(
      new DtoValidationPipe({
        skipMissingProperties: false,
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    )
    createRoleDto: CreateRolesDto
  ): Promise<CreateRolesDto> {
    return this.rolesService.create(createRoleDto);
  }

  @ApiBearerAuth()
  @Get(":id")
  findOne(@Param('id', new IntValidationPipe()) id: number): Promise<CreateRolesDto> {
    return this.rolesService.findOne(id);
  }

  @ApiBearerAuth()
  @Put(":id")
  update(
    @Param('id',new IntValidationPipe()) id: number,
    @Body(new DtoValidationPipe()) dto: CreateRolesDto
  ): Promise<CreateRolesDto> {
    return this.rolesService.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(":id")
  remove(@Param('id',new IntValidationPipe()) id: number): Promise<CreateRolesDto> {
    return this.rolesService.remove(id);
  }
}
