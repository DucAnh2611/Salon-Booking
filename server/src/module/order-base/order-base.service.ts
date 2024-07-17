import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderPaymentTypeEnum, OrderStatusEnum } from '../../common/enum/order.enum';
import { CreateOrderBaseDto } from './dto/order-base-create.dto';
import { OrderEntity } from './entity/order-base.entity';

const TAX_RATE = 0.08;

@Injectable()
export class OrderBaseService {
    constructor(@InjectRepository(OrderEntity) private readonly orderBaseReposiroty: Repository<OrderEntity>) {}

    get(orderId: string) {
        return this.orderBaseReposiroty.findOne({ where: { id: orderId } });
    }

    create(clientId: string, body: CreateOrderBaseDto) {
        const { address, name, paymentType, phone, total, note } = body;

        const taxAmount = Math.round(total * (1 + TAX_RATE));

        const instance = this.orderBaseReposiroty.create({
            clientId,
            name,
            paymentType,
            phone,
            note,
            address,
            tax: taxAmount,
            taxRate: TAX_RATE * 100,
            total: total + taxAmount,
            status: paymentType === OrderPaymentTypeEnum.CASH ? OrderStatusEnum.CONFIRMED : OrderStatusEnum.PENDING,
        });

        return this.orderBaseReposiroty.save(instance);
    }
}
