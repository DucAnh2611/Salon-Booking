import * as crypto from 'crypto';
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { OrderPaymentTypeEnum, OrderStatusEnum } from '../../../common/enum/order.enum';
import { OrderProductItemEntity } from '../../order-product-item/entity/order-product-item.entity';
import { OrderServiceItemEntity } from '../../order-service-item/entity/order-service-item.entity';
import { OrderTransactionEntity } from '../../order-transaction/entity/order-transaction.entity';

function generateOrderCode() {
    const timestamp = Date.now().toString(36);
    const randomString = crypto.randomBytes(4).toString('hex');
    return `${timestamp}${randomString}`.toUpperCase();
}

@Entity('order')
export class OrderEntity extends ModifyEntity {
    @Column('varchar')
    code: string;

    @Column('uuid')
    clientId: string;

    @Column('text')
    name: string;

    @Column('text')
    address: string;

    @Column('varchar')
    phone: string;

    @Column('text', { nullable: true })
    note: string;

    @Column('integer')
    total: number;

    @Column('integer')
    taxRate: number;

    @Column('integer')
    tax: number;

    @Column('integer')
    orderDate: Date;

    @Column('enum', { enum: OrderPaymentTypeEnum })
    paymentType: OrderPaymentTypeEnum;

    @Column('enum', { enum: OrderStatusEnum })
    status: OrderStatusEnum;

    @CreateDateColumn({ type: 'time with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'time with time zone' })
    updatedAt: Date;

    @OneToMany(
        () => OrderProductItemEntity,
        (orderPRoductItemEntity: OrderProductItemEntity) => orderPRoductItemEntity.order,
    )
    products: OrderProductItemEntity[];

    @OneToMany(
        () => OrderServiceItemEntity,
        (orderServiceItemEntity: OrderServiceItemEntity) => orderServiceItemEntity.order,
    )
    services: OrderServiceItemEntity[];

    @OneToMany(
        () => OrderTransactionEntity,
        (orderTransactionEntity: OrderTransactionEntity) => orderTransactionEntity.order,
    )
    transactions: OrderTransactionEntity[];

    @BeforeInsert()
    createCode() {
        this.code = generateOrderCode();
    }
}
