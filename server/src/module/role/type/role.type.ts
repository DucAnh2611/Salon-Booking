import { FindOptionsWhere } from 'typeorm';
import { RoleEntity } from '../enitty/role.entity';

export type TRoleGetRoleQuery = FindOptionsWhere<RoleEntity>;
