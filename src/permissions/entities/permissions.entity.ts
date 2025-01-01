
import { CustomBaseEntity } from "common/entities/entities.config";
import { RoleEntity } from "../../roles/entities/roles.entity";
import { Column, Entity, Index, JoinTable, ManyToMany } from "typeorm";

@Entity({name: 'co_permissions', schema: 'public'})
@Index(['id'])
export class PermissionsEntity extends CustomBaseEntity {
    @Column({name: 'name', type: 'varchar', unique: true, nullable: false})
    name: string;

    @ManyToMany(() => RoleEntity, (roleEntity) => roleEntity.permissions)
    @JoinTable({
    name: 'co_role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  roles: RoleEntity[];
}
