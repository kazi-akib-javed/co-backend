import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DtoValidationPipe } from 'common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './permissions.service';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOne(+id);
  }

  @ApiBearerAuth()
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(DtoValidationPipe) dto: CreatePermissionDto) {
    return this.permissionsService.update(+id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.remove(+id);
  }
}
