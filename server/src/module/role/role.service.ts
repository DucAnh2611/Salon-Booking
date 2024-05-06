import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './enitty/role.entity';
import { TRoleGetRoleQuery } from './type/role.type';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>) {}

  async getRoleId(query: TRoleGetRoleQuery) {
    const role = await this.getRole(query);
    return role.id;
  }

  getRole(query: TRoleGetRoleQuery) {
    return this.roleRepository.findOneBy(query);
  }
}
