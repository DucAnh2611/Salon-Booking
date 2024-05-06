import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleEntity } from './enitty/role.entity';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), RolePermissionModule],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
