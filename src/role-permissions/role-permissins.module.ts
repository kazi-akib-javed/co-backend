import { Module } from "@nestjs/common";
import { RolePermissionsController } from "./role-permissions.controller";
import { RolePermissionsService } from "./role-permissions.service";

@Module({
    imports:[],
    controllers:[RolePermissionsController],
    providers:[RolePermissionsService]
})
export class RolePermissionsModule{}