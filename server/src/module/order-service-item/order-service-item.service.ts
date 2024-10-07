import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { ShiftEmployeeStatusEnum } from '../../common/enum/shift.enum';
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

    getEmployeeOrder(orderId: string) {
        return this.orderServiceItemRepository.find({ where: { orderId }, loadEagerRelations: false });
    }

    async employeeJob(employeeId: string, orderIds: string[]) {
        const jobs = await this.orderServiceItemRepository.find({
            where: {
                employeeId: employeeId,
                orderId: In(orderIds),
            },
            loadEagerRelations: false,
        });

        return jobs;
    }

    async setAvailableEmployeeOrder(orderId: string) {
        const items = await this.orderServiceItemRepository.find({ where: { orderId }, loadEagerRelations: false });

        await Promise.all(
            items.map(item =>
                this.shiftEmployeeService.updateStatus(item.employeeId, {
                    shiftId: item.shiftId,
                    status: ShiftEmployeeStatusEnum.AVAILABLE,
                }),
            ),
        );
    }

    getServiceOrder(orderId: string) {
        return this.orderServiceItemRepository.find({ where: { orderId }, loadEagerRelations: false });
    }

    async checkService(item: CreateOrderServiceItemDto) {
        const { shiftId, employeeId, serviceId, bookingTime, itemId } = item;

        const service = await this.serviceBaseService.isValid(serviceId);
        if (!service) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE });
        }

        const employee = await this.employeeService.getById(employeeId);
        if (!employee) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_EMPLOYEE });
        }

        const serviceEmployee = await this.serviceEmployeeService.isExist(serviceId, employeeId);
        if (!serviceEmployee) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SERVICE_EMPLOYEE });
        }

        const shift = await this.shiftService.isExist(shiftId);
        if (!shift) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_SHIFT });
        }

        const isEmployeeInShift = await this.shiftEmployeeService.isEmployeeInShift(employeeId, shift.id);
        if (!isEmployeeInShift) {
            throw new BadRequest({ message: DataErrorCodeEnum.EMPLOYEE_NOT_IN_SHIFT });
        }

        const isAvailable = isEmployeeInShift.status === ShiftEmployeeStatusEnum.AVAILABLE;
        if (!isAvailable) {
            throw new BadRequest({ message: DataErrorCodeEnum.EMPLOYEE_IS_NOT_AVAILABLE });
        }

        const serviceDuration = new Date(bookingTime);
        serviceDuration.setMinutes(serviceDuration.getMinutes() + service.duration);

        const isServiceWithinShift =
            shift.bookingEnd.getTime() >= serviceDuration.getTime() &&
            shift.bookingStart.getTime() <= serviceDuration.getTime();
        if (!isServiceWithinShift) {
            throw new BadRequest({ message: DataErrorCodeEnum.BOOKING_TIME_OUTSIDE_SHIFT });
        }

        return true;
    }

    async checkListService(list: CreateOrderServiceItemDto[]) {
        if (!list.length) {
            throw new BadRequest({ message: DataErrorCodeEnum.NO_ORDER_ITEM });
        }

        await Promise.all(list.map(item => this.checkService(item)));

        return true;
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
            this.serviceEmployeeService.getSnapShot(serviceId, employeeId),
        ]);
    }

    async add(orderId: string, body: CreateOrderServiceItemDto[]) {
        const snapshotList = await Promise.all(body.map(item => this.getSnapshot(item.serviceId, item.employeeId)));

        const savedOrderService = await this.orderServiceItemRepository.save(
            body.map(item => {
                const { shiftId, employeeId, serviceId, bookingTime } = item;
                const [serviceSnapshot, employeeSnapShot] = snapshotList.find(
                    ([service, employee]) => service.id === serviceId && employee.employeeId === employeeId,
                );

                return this.orderServiceItemRepository.create({
                    orderId,
                    shiftId,
                    bookingTime,
                    serviceSnapshot,
                    employeeSnapShot: employeeSnapShot,
                    employeeId,
                    serviceId,
                });
            }),
        );

        return DataSuccessCodeEnum.OK;
    }
}
