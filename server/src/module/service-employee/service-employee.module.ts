import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceBaseModule } from '../service-base/service-base.module';
import { ServiceEmpleeEntity } from './entity/service-employee.entity';
import { ServiceEmployeeService } from './service-employee.service';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceEmpleeEntity]), ServiceBaseModule],
    providers: [ServiceEmployeeService],
    exports: [ServiceEmployeeService],
})
export class ServiceEmployeeModule {}
