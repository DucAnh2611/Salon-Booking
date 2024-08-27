import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { EmployeeService } from '../employee/employee.service';
import { ServiceBaseService } from '../service-base/service-base.service';
import { ServiceEmployeeService } from '../service-employee/service-employee.service';
import { ShiftEmployeeService } from '../shift-employee/shift-employee.service';
import { ShiftService } from '../shift/shift.service';
import { CreateOrderServiceItemDto } from './dto/order-service-item-create.dto';
import { OrderServiceItemEntity } from './entity/order-service-item.entity';

@Injectable()
export class OrderServiceItemService {
    constructor(
        @InjectRepository(OrderServiceItemEntity)
        private readonly orderServiceItemRepository: Repository<OrderServiceItemEntity>,
        private readonly serviceEmployeeService: ServiceEmployeeService,
        private readonly serviceBaseService: ServiceBaseService,
        private readonly employeeService: EmployeeService,
        private readonly shiftEmployeeService: ShiftEmployeeService,
        private readonly shiftService: ShiftService,
    ) {}

    getServiceOrder(orderId: string) {
        return this.orderServiceItemRepository.find({ where: { orderId }, loadEagerRelations: false });
    }

    async checkService(item: CreateOrderServiceItemDto) {
        const { shiftId, employeeId, serviceId } = item;

        const isValidServiceEmployee = await this.serviceEmployeeService.isExist(serviceId, employeeId);
        if (!isValidServiceEmployee) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE_EMPLOYEE });
        }

        const service = await this.serviceBaseService.isValid(serviceId);
        if (!service) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE });
        }

        const employee = await this.employeeService.getById(employeeId);
        if (!employee) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_EMPLOYEE });
        }

        const shift = await this.shiftService.isExist(shiftId);
        if (!shift) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SHIFT });
        }
        const serviceDuration = new Date(shift.bookingStart);
        serviceDuration.setMinutes(shift.bookingStart.getMinutes() + service.duration);

        const isServiceWithinShift = shift.bookingEnd.getTime() <= serviceDuration.getTime();
        if (!isServiceWithinShift) {
            throw new BadRequest({ message: DataErrorCodeEnum.BOOKING_TIME_OUTSIDE_SHIFT });
        }

        const isEmployeeInShift = await this.shiftEmployeeService.isEmployeeInShift(employeeId, shift.id);
        if (!isEmployeeInShift) {
            throw new BadRequest({ message: DataErrorCodeEnum.EMPLOYEE_NOT_IN_SHIFT });
        }

        return true;
    }

    async checkListService(list: CreateOrderServiceItemDto[]) {
        if (!list.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.NO_ORDER_ITEM });
        }
        const checkList = await Promise.all(list.map(item => this.checkService(item)));
        return checkList.filter(item => item).length === list.length;
    }

    async getTotalAmount(list: CreateOrderServiceItemDto[]) {
        const snapshots = await Promise.all(list.map(item => this.getSnapshot(item.serviceId, item.employeeId)));

        return snapshots.reduce((acc, item) => {
            const [service] = item;

            return acc + service.price;
        }, 0);
    }

    async getSnapshot(serviceId: string, employeeId: string) {
        return Promise.all([
            this.serviceBaseService.getSnapshot(serviceId),
            this.employeeService.getSnapshot(employeeId),
        ]);
    }

    async add(orderId: string, body: CreateOrderServiceItemDto[]) {
        const checkListService = await this.checkListService(body);
        if (!checkListService) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_SERVICE_EMPLOYEE });
        }

        const snapshotList = await Promise.all(body.map(item => this.getSnapshot(item.serviceId, item.employeeId)));

        const savedOrderService = await this.orderServiceItemRepository.save(
            body.map(item => {
                const { shiftId, employeeId, serviceId, bookingTime } = item;
                const [serviceSnapshot, employeeSnapShot] = snapshotList.find(
                    ([service, employee]) => service.id === serviceId && employee.id === employeeId,
                );

                return this.orderServiceItemRepository.create({
                    orderId,
                    shiftId,
                    bookingTime,
                    serviceSnapshot,
                    employeeSnapShot,
                    employeeId,
                    serviceId,
                });
            }),
        );

        return DataSuccessCodeEnum.OK;
    }
}
