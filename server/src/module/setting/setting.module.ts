import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';

@Module({
    imports: [RedisModule, RoleModule, RolePermissionModule],
    controllers: [SettingController],
    providers: [SettingService],
    exports: [SettingService],
})
export class SettingModule {}
