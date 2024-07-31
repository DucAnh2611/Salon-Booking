import { Injectable } from '@nestjs/common';
import { ServiceBaseService } from '../service-base/service-base.service';
import { ServiceEmployeeService } from '../service-employee/service-employee.service';
import { ServiceMediaService } from '../service-media/service-media.service';
import { ServiceStepService } from '../service-step/service-step.service';
import { CreateServiceDto } from './dto/service-create.dto';
import { FindServiceAdminDto } from './dto/service-get.dto';
import { UpdateServiceDto } from './dto/service-update.dto';

@Injectable()
export class ServiceService {
    constructor(
        private readonly serviceBaseService: ServiceBaseService,
        private readonly serviceEmployeeService: ServiceEmployeeService,
        private readonly serviceStepService: ServiceStepService,
        private readonly serviceMediaService: ServiceMediaService,
    ) {}

    async detail(serviceId: string) {
        const serviceBase = await this.serviceBaseService.detail(serviceId);

        const serviceEmployee = await this.serviceEmployeeService.detailByServiceId(serviceId);

        const serviceSteps = await this.serviceStepService.getStepDetailService(serviceId);

        return {
            base: serviceBase,
            employees: serviceEmployee,
            steps: serviceSteps,
        };
    }

    async findAdmin(query: FindServiceAdminDto) {
        const { list: listService, count, page, limit } = await this.serviceBaseService.findAdmin(query);
        const listMapMedia = await Promise.all(
            listService.map(async service => {
                const media = await this.serviceMediaService.getListByService(service.id);
                return {
                    ...service,
                    media,
                };
            }),
        );

        return { items: listMapMedia, count, page, limit };
    }

    async find(query: FindServiceAdminDto) {
        const { list: listService, count, page, limit } = await this.serviceBaseService.findAdmin(query);
        const listMapMedia = await Promise.all(
            listService.map(async service => {
                const media = await this.serviceMediaService.getListByService(service.id);
                return {
                    ...service,
                    media,
                };
            }),
        );

        return { items: listMapMedia, count, page, limit };
    }

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

    async delete(ids: string[]) {
        const deleted = await this.serviceBaseService.deleteMany(ids);
    }
}
