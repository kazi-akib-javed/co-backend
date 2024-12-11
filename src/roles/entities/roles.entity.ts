import { CustomBaseEntity } from "common/entities/entities.config";
import { PermissionEntity } from "src/permissions/entities/permission.entity";
import { Column, Entity, Index, ManyToMany } from "typeorm";
@Entity({name: 'co_roles', schema: 'public'})
@Index(['id'])
export class RoleEntity extends CustomBaseEntity {
    @Column({name: 'name', nullable: false, unique: true, default: 'user', type: 'varchar'})
    name: string;

    @ManyToMany(() => PermissionEntity, (permissionEntity) => permissionEntity.roles)
    permissions: PermissionEntity[];
}
