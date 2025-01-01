import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Role Permissions')
@Controller('role-permissions')
export class RolePermissionsController{
    constructor(){}
}