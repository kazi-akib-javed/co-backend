import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { DtoValidationPipe } from 'common';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(DtoValidationPipe) updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.remove(+id);
  }
}
