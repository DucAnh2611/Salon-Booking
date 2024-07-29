import { Module } from '@nestjs/common';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { ServiceBaseModule } from '../service-base/service-base.module';
import { ServiceEmployeeModule } from '../service-employee/service-employee.module';
import { ServiceMediaModule } from '../service-media/service-media.module';
import { ServiceStepModule } from '../service-step/service-step.module';
import { ServiceAdminController } from './controller/service-admin.controller';
import { ServiceService } from './service.service';

@Module({
    imports: [
        ServiceBaseModule,
        ServiceStepModule,
        ServiceMediaModule,
        ServiceEmployeeModule,
        RoleModule,
        RolePermissionModule,
    ],
    controllers: [ServiceAdminController],
    providers: [ServiceService],
    exports: [ServiceService],
})
export class ServiceModule {}
