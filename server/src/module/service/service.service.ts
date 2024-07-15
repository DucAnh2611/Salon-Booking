import { Injectable } from '@nestjs/common';
import { ServiceBaseService } from '../service-base/service-base.service';
import { ServiceEmployeeService } from '../service-employee/service-employee.service';
import { ServiceStepService } from '../service-step/service-step.service';
import { CreateServiceDto } from './dto/service-create.dto';
import { UpdateServiceDto } from './dto/service-update.dto';

@Injectable()
export class ServiceService {
    constructor(
        private readonly serviceBaseService: ServiceBaseService,
        private readonly serviceEmployeeService: ServiceEmployeeService,
        private readonly serviceStepService: ServiceStepService,
    ) {}

    async create(userId: string, employeeId: string, body: CreateServiceDto) {
        const { base, employees, steps } = body;

        const savedBase = await this.serviceBaseService.save(userId, employeeId, base);

        const [savedEmps, savedSteps] = await Promise.all([
            this.serviceEmployeeService.saveMany(employeeId, { serviceId: savedBase.id, employees }),
            this.serviceStepService.saveMany(userId, employeeId, { serviceId: savedBase.id, steps }),
        ]);

        return {
            ...savedBase,
            employees: savedEmps,
            steps: savedSteps,
        };
    }

    async update(userId: string, employeeId: string, body: UpdateServiceDto) {
        const { base, employees, steps } = body;
        const { serviceId } = base;

        const [updatedBase, updatedEmps, updatedSteps] = await Promise.all([
            this.serviceBaseService.update(userId, employeeId, base),
            this.serviceEmployeeService.updateMany(employeeId, { serviceId, employees }),
            this.serviceStepService.updateMany(userId, employeeId, { serviceId, steps }),
        ]);

        return {
            ...updatedBase,
            employees: updatedEmps,
            steps: updatedSteps,
        };
    }
}
