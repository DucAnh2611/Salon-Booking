import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { OrderStatusEnum } from '../../common/enum/order.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { CreateOrderBaseDto } from './dto/order-base-create.dto';
import { FindOrderClientDto } from './dto/order-base-get.dto';
import { OrderEntity } from './entity/order-base.entity';

export const TAX_RATE = 0.08;

@Injectable()
export class OrderBaseService {
    constructor(@InjectRepository(OrderEntity) private readonly orderBaseRepository: Repository<OrderEntity>) {}

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
    getCode(code: string, clientId: string) {
        return this.orderBaseRepository.findOne({ where: { code: code, clientId }, loadEagerRelations: false });
    }

    get(orderId: string) {
        return this.orderBaseRepository.findOne({ where: { id: orderId }, loadEagerRelations: false });
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
            refund: false,
            status: OrderStatusEnum.CONFIRMED,
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

    async paidSuccessfull(userId: string, orderId: string) {
        const order = await this.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        await this.orderBaseRepository.update({ id: orderId }, { paid: true, updatedBy: userId });

        return DataSuccessCodeEnum.OK;
    }

    async paidFailed(userId: string, orderId: string) {
        const order = await this.get(orderId);
        if (!order) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORDER });
        }

        await this.orderBaseRepository.update({ id: orderId }, { paid: false, updatedBy: userId });

        return DataSuccessCodeEnum.OK;
    }
}
