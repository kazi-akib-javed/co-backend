import {
    Column,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
  } from 'typeorm';
  import { CustomBaseEntity } from './custom-base.entity';
import { RoleEntity } from '../../src/roles/entities/roles.entity';
  
  @Entity({ name: 'co_users', schema: 'public' })
  @Index(['id', 'email'])
  export class UsersEntity extends CustomBaseEntity {
    @Column({
      type: 'varchar',
      name: 'first_name',
      unique: false,
      nullable: false,
    })
    firstName: string;
  
    @Column({
      type: 'varchar',
      name: 'last_name',
      unique: false,
      nullable: false,
    })
    lastName: string;
  
    @Column({ type: 'varchar', name: 'email', unique: true, nullable: false })
    email: string;
  
    @Column({ type: 'varchar', name: 'user_id', unique: false, nullable: true })
    userId: string;
  
    @Column({ type: 'varchar', name: 'password', unique: false, nullable: false })
    password: string;
  
    @Column({
      name: 'reset_password_token',
      type: 'varchar',
      unique: false,
      nullable: true,
    })
    resetPasswordToken: string;

    @Column({
      name: 'refresh_token',
      type: 'varchar',
      unique: false,
      nullable: true,
    })
    refreshToken: string;
  
    @Column({
      name: 'reset_password_validity',
      type: 'date',
      unique: false,
      nullable: true,
    })
    resetPasswordValidity: Date;
  
    @Column({
      name: 'reset_password_flag',
      type: 'boolean',
      unique: false,
      nullable: false,
      default: false,
    })
    resetPasswordFlag: boolean;
  
    @Column({ name: 'address', type: 'varchar', nullable: true })
    address: string;
  
    @Column({ name: 'phone', type: 'varchar', unique: true, nullable: true })
    phone: string;

    @OneToOne(()=> RoleEntity)
    @JoinColumn({name: 'role_id'})
    role: RoleEntity;
  }