import { CustomBaseEntity } from "../../../common/entities/entities.config";
import { PermissionsEntity } from "../../permissions/entities/permissions.entity";
import { Column, Entity, Index, ManyToMany } from "typeorm";
@Entity({name: 'co_roles', schema: 'public'})
@Index(['id'])
export class RoleEntity extends CustomBaseEntity {
    @Column({name: 'name', nullable: false, unique: true, default: 'user', type: 'varchar'})
    name: string;

    @ManyToMany(() => PermissionsEntity, (permissionEntity) => permissionEntity.roles)
    permissions: PermissionsEntity[];
}
