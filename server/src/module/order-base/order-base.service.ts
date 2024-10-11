import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { TAX_RATE } from '../../common/constant/order.contant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { OrderStatusEnum, OrderType } from '../../common/enum/order.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { GetJobQueryListDto } from '../order/dto/order-get.dto';
import { CreateOrderBaseDto } from './dto/order-base-create.dto';
import { FindOrderAdminDto, FindOrderClientDto } from './dto/order-base-get.dto';
import { OrderEntity } from './entity/order-base.entity';

@Injectable()
export class OrderBaseService {
    constructor(@InjectRepository(OrderEntity) private readonly orderBaseRepository: Repository<OrderEntity>) {}

    getQueryRunner() {
        return this.orderBaseRepository.manager.connection.createQueryRunner();
    }

    async getOrderRange(emploeeId: string, body: GetJobQueryListDto) {
        const { from, limit, page, to } = body;

        if (from || to) {
            if (from) {
                from.setDate(from.getDate() - 1);
            }
            if (to) {
                to.setDate(to.getDate());
            }
        }

        const [items, count] = await this.orderBaseRepository.findAndCount({
            where: {
                ...(from
                    ? to
                        ? { createdAt: Between(from, to) }
                        : { createdAt: MoreThanOrEqual(from) }
                    : to
                      ? { createdAt: LessThanOrEqual(to) }
                      : {}),
                services: {
                    employeeId: emploeeId,
                },
                type: OrderType.SERVICE,
            },
            loadEagerRelations: false,
            relations: {
                services: true,
            },
            order: {
                createdAt: SortByEnum.DESC,
                status: SortByEnum.ASC,
            },
            take: limit,
            skip: (page - 1) * limit,
        });

        return { count, items, page, limit };
    }

    async isOwn(orderId: string, clientId: string) {
        const order = await this.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        if (order.clientId !== clientId) {
            return false;
        }
        return true;
    }

    async updatePaid(orderId: string, paid: boolean, userId: string) {
        const order = await this.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        await this.orderBaseRepository.update({ id: orderId }, { paid, updatedBy: userId });
        return DataSuccessCodeEnum.OK;
    }

    async updateState(orderId: string, state: OrderStatusEnum, userId: string) {
        const order = await this.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        await this.orderBaseRepository.update({ id: orderId }, { status: state, updatedBy: userId });
        return DataSuccessCodeEnum.OK;
    }

    async updateTotalPaid(orderId: string, paid: number, userId: string) {
        const order = await this.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        await this.orderBaseRepository.update({ id: orderId }, { totalPaid: paid, updatedBy: userId });
        return DataSuccessCodeEnum.OK;
    }

    async getOrderClient(clientId: string, body: FindOrderClientDto) {
        const { limit, page, order, filter } = body;

        const { from, to, code, ...filterProps } = filter;
        return this.orderBaseRepository.findAndCount({
            where: {
                ...filterProps,
                code: Like(`%${code || ''}%`),
                ...(from
                    ? to
                        ? { createdAt: Between(from, new Date(to.getTime() + 24 * 60 * 60 * 1000)) }
                        : { createdAt: MoreThanOrEqual(from) }
                    : to
                      ? { createdAt: LessThanOrEqual(new Date(to.getTime() + 24 * 60 * 60 * 1000)) }
                      : {}),
                clientId,
            },
            loadEagerRelations: false,
            take: limit,
            skip: (page - 1) * limit,
            order: {
                ...(Object.entries(order).length ? order : { createdAt: SortByEnum.ASC }),
            },
            relations: {
                orderState: true,
            },
        });
    }

    async getOrderAdmin(body: FindOrderAdminDto) {
        const { limit, page, order, filter } = body;

        const { from, to, code, ...filterProps } = filter;

        return this.orderBaseRepository.findAndCount({
            where: {
                ...filterProps,
                code: Like(`%${code || ''}%`),
                ...(from
                    ? to
                        ? { createdAt: Between(from, new Date(to.getTime() + 24 * 60 * 60 * 1000)) }
                        : { createdAt: MoreThanOrEqual(from) }
                    : to
                      ? { createdAt: LessThanOrEqual(new Date(to.getTime() + 24 * 60 * 60 * 1000)) }
                      : {}),
            },
            loadEagerRelations: false,
            take: limit,
            skip: (page - 1) * limit,
            order: {
                ...(Object.entries(order).length ? order : { createdAt: SortByEnum.ASC }),
            },
        });
    }

    getExpiredOrderService() {
        return this.orderBaseRepository.find({
            where: {
                type: OrderType.SERVICE,
                confirmExpired: LessThanOrEqual(new Date()),
                status: In([OrderStatusEnum.PAID_PAYMENT, OrderStatusEnum.PENDING_PAYMENT, OrderStatusEnum.PENDING]),
            },
            loadEagerRelations: false,
            relations: {
                services: true,
            },
        });
    }

    cancelExpiredOrder(id: string) {
        return this.orderBaseRepository.update({ id: id }, { status: OrderStatusEnum.CANCELLED });
    }

    getCode(code: string, clientId: string) {
        return this.orderBaseRepository.findOne({ where: { code: code, clientId }, loadEagerRelations: false });
    }

    get(orderId: string) {
        return this.orderBaseRepository.findOne({ where: { id: orderId }, loadEagerRelations: false });
    }

    getAdmin(orderId: string) {
        return this.orderBaseRepository.findOne({
            where: { id: orderId },
            loadEagerRelations: false,
            relations: {
                userCreate: {
                    client: true,
                },
            },
        });
    }

    create(userId: string, clientId: string, body: CreateOrderBaseDto) {
        const { address, name, paymentType, phone, total, note, type } = body;

        const taxAmount = Math.round(total * TAX_RATE);

        const instance = this.orderBaseRepository.create({
            clientId,
            name,
            paymentType,
            phone,
            note,
            address,
            tax: taxAmount,
            paid: false,
            status: OrderStatusEnum.PENDING,
            taxRate: TAX_RATE * 100,
            total: total + taxAmount,
            totalPaid: 0,
            createdBy: userId,
            updatedBy: userId,
            orderDate: new Date(),
            type,
        });

        return this.orderBaseRepository.save(instance);
    }

    async paidSuccessfull(userId: string, orderId: string, paidAmount: number) {
        const order = await this.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        await this.orderBaseRepository.update(
            { id: orderId },
            {
                paid: true,
                status: OrderStatusEnum.PAID_PAYMENT,
                totalPaid: paidAmount,
                updatedBy: userId,
            },
        );

        return DataSuccessCodeEnum.OK;
    }

    async paidFailed(userId: string, orderId: string, paidAmount: number) {
        const order = await this.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        await this.orderBaseRepository.update(
            { id: orderId },
            { paid: false, status: OrderStatusEnum.PENDING_PAYMENT, totalPaid: paidAmount, updatedBy: userId },
        );

        return DataSuccessCodeEnum.OK;
    }
}
