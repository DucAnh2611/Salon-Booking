import { FindOptionsWhere } from 'typeorm';
import { RoleEntity } from '../entity/role.entity';

export type TRoleGetRoleQuery = FindOptionsWhere<RoleEntity>;
