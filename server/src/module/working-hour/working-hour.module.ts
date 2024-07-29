import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { WorkingHourAdminController } from './controller/working-hour-admin.controller';
import { WorkingHourEntity } from './entity/working-hour.entity';
import { WorkingHourService } from './working-hour.service';

@Module({
    imports: [TypeOrmModule.forFeature([WorkingHourEntity]), RoleModule, RolePermissionModule],
    controllers: [WorkingHourAdminController],
    providers: [WorkingHourService],
    exports: [WorkingHourService],
})
export class WorkingHourModule {}
