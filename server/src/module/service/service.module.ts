import { Module } from '@nestjs/common';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { ServiceBaseModule } from '../service-base/service-base.module';
import { ServiceEmployeeModule } from '../service-employee/service-employee.module';
import { ServiceMediaModule } from '../service-media/service-media.module';
import { ServiceStepModule } from '../service-step/service-step.module';
import { ServiceAdminController } from './controller/service-admin.controller';
import { ServiceController } from './controller/service.controller';
import { ServiceAdminService } from './service/service-admin.service';
import { ServiceService } from './service/service.service';

@Module({
    imports: [
        ServiceBaseModule,
        ServiceStepModule,
        ServiceMediaModule,
        ServiceEmployeeModule,
        RoleModule,
        RolePermissionModule,
    ],
    controllers: [ServiceAdminController, ServiceController],
    providers: [ServiceAdminService, ServiceService],
    exports: [ServiceAdminService, ServiceService],
})
export class ServiceModule {}
