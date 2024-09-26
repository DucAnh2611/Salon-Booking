import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { OrderPaymentStatusEnum } from '../../../common/enum/order.enum';
import { OrderRefundRequestEntity } from '../../oder-refund-request/entity/order-refund-request.entity';
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
    accountBankBin: string;

    @Column('varchar')
    accountNumber: string;

    @Column('varchar')
    accountName: string;

    @Column('varchar', { nullable: true })
    buyerAccountBankBin: string;

    @Column('varchar', { nullable: true })
    buyerAccountNumber: string;

    @Column('varchar', { nullable: true })
    buyerAccountName: string;

    @Column('text')
    description: string;

    @Column('text')
    paymentUrl: string;

    @Column('jsonb', { default: [] })
    paymentTransactions: object[];

    @Column('timestamp with time zone', { nullable: true })
    expireAt: Date;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @Column('enum', { enum: OrderPaymentStatusEnum, default: OrderPaymentStatusEnum.PENDING })
    status: OrderPaymentStatusEnum;

    @ManyToOne(() => OrderEntity, (orderEntity: OrderEntity) => orderEntity.transactions)
    @JoinColumn({ name: 'orderId' })
    order: OrderEntity;

    @OneToMany(
        () => OrderRefundRequestEntity,
        (orderRefundRequest: OrderRefundRequestEntity) => orderRefundRequest.transaction,
    )
    @JoinColumn({ name: 'orderId' })
    refundRequest: OrderRefundRequestEntity[];
}
