import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { OrderPaymentStatusEnum } from '../../../common/enum/order.enum';
import { OrderEntity } from '../../order-base/entity/order-base.entity';

@Entity('order_transaction')
export class OrderTransactionEntity extends BaseEntity {
    @Column('varchar', { length: 50 })
    paymentId: string;

    @Column('uuid')
    orderId: string;

    @Column('varchar')
    orderCode: string;

    @Column('integer')
    orderAmount: number;

    @Column('integer', { nullable: true, default: 0 })
    paidAmount: number;

    @Column('varchar')
    accountNumber: string;

    @Column('varchar')
    accountName: string;

    @Column('text')
    description: string;

    @Column('text')
    paymentUrl: string;

    @Column('timestamp with time zone')
    expireAt: Date;

    @CreateDateColumn({ type: 'time with time zone' })
    createAt: Date;

    @Column('enum', { enum: OrderPaymentStatusEnum, default: OrderPaymentStatusEnum.PENDING })
    status: OrderPaymentStatusEnum;

    @ManyToOne(() => OrderEntity, (orderEntity: OrderEntity) => orderEntity.transactions)
    @JoinColumn({ name: 'orderId' })
    order: OrderEntity;
}
