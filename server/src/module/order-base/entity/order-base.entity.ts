import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    UpdateDateColumn,
} from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { OrderPaymentTypeEnum, OrderStatusEnum, OrderType } from '../../../common/enum/order.enum';
import { ClientEntity } from '../../client/entity/client.entity';
import { OrderRefundRequestEntity } from '../../oder-refund-request/entity/order-refund-request.entity';
import { OrderProductItemEntity } from '../../order-product-item/entity/order-product-item.entity';
import { OrderServiceItemEntity } from '../../order-service-item/entity/order-service-item.entity';
import { OrderStateEntity } from '../../order-state/entity/order-state.entity';
import { OrderTransactionEntity } from '../../order-transaction/entity/order-transaction.entity';
import { UserEntity } from '../../user/entity/user.entity';

function generateOrderCode() {
    const timestamp = Date.now();

    const timestampPart = timestamp.toString().slice(-5);

    const randomPart = Math.floor(10000 + Math.random() * 90000);

    const orderCode = `${randomPart}${timestampPart}`;

    return orderCode;
}

@Entity('order')
export class OrderEntity extends ModifyEntity {
    @Column('varchar')
    code: string;

    @Column('uuid')
    clientId: string;

    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    address: string;

    @Column('varchar')
    phone: string;

    @Column('text', { nullable: true })
    note: string;

    @Column('integer')
    total: number;

    @Column('integer', { default: 0 })
    totalPaid: number;

    @Column('integer')
    taxRate: number;

    @Column('integer')
    tax: number;

    @Column('boolean', { default: false })
    paid: boolean;

    @Column('timestamp with time zone')
    orderDate: Date;

    @Column('enum', { enum: OrderStatusEnum })
    status: OrderStatusEnum;

    @Column('enum', { enum: OrderType })
    type: OrderType;

    @Column('enum', { enum: OrderPaymentTypeEnum })
    paymentType: OrderPaymentTypeEnum;

    @Column('timestamp with time zone', { nullable: true })
    confirmExpired: Date;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
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

    @OneToMany(
        () => OrderRefundRequestEntity,
        (orderRefundRequestEntity: OrderRefundRequestEntity) => orderRefundRequestEntity.order,
    )
    refundRequests: OrderRefundRequestEntity[];

    @OneToMany(() => OrderStateEntity, (orderStateEntity: OrderStateEntity) => orderStateEntity.order)
    orderState: OrderStateEntity[];

    @ManyToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.createOrder)
    @JoinColumn({ name: 'createdBy' })
    userCreate: UserEntity;

    @ManyToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.updateOrder)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: UserEntity;

    @ManyToOne(() => ClientEntity, (clientEntity: ClientEntity) => clientEntity.orderOwner)
    @JoinColumn({ name: 'clientId' })
    client: ClientEntity;

    @BeforeInsert()
    initDefault() {
        this.code = generateOrderCode();
    }
}
