import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from './entity/permission.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(PermissionEntity) private readonly permissionRepository: Repository<PermissionEntity>,
    ) {}

    async isValidPermissions(permissions: string[]) {
        try {
            await Promise.all(
                permissions.map((permission: string) => this.permissionRepository.findOneBy({ id: permission })),
            );
            return true;
        } catch (err) {
            return false;
        }
    }
}
