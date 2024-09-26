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
import { BaseEntity } from '../../../common/enitty/base.entity';
import { OrderRefundRequestStatusEnum } from '../../../common/enum/order.enum';
import { OrderEntity } from '../../order-base/entity/order-base.entity';
import { OrderRefundStateEntity } from '../../order-refund-state/entity/order-refund-state.entity';
import { OrderTransactionEntity } from '../../order-transaction/entity/order-transaction.entity';
import { UserEntity } from '../../user/entity/user.entity';

const EXPIRE_REQUEST_MINUTES = 24 * 60;

@Entity('order_refund_request')
export class OrderRefundRequestEntity extends BaseEntity {
    @Column('uuid')
    orderId: string;

    @Column('uuid', { nullable: true })
    transactionId: string;

    @Column('integer')
    amount: number;

    @Column('enum', { enum: OrderRefundRequestStatusEnum, default: OrderRefundRequestStatusEnum.PENDING })
    status: OrderRefundRequestStatusEnum;

    @Column('timestamp with time zone')
    expiredAt: Date;

    @Column('uuid')
    createdBy: string;

    @Column('uuid')
    updatedBy: string;

    @Column('text', { nullable: true, default: '' })
    description: string;

    @Column('varchar', { length: 50 })
    accountBankBin: string;

    @Column('varchar', { length: 50 })
    accountBankNumber: string;

    @Column('varchar', { length: 50 })
    accountBankName: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @ManyToOne(() => OrderEntity, (orderEntity: OrderEntity) => orderEntity.refundRequests)
    @JoinColumn({ name: 'orderId' })
    order: OrderEntity;

    @ManyToOne(
        () => OrderTransactionEntity,
        (orderTransactionEntity: OrderTransactionEntity) => orderTransactionEntity.refundRequest,
    )
    @JoinColumn({ name: 'transactionId' })
    transaction: OrderTransactionEntity;

    @ManyToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.createOrderRefund)
    @JoinColumn({ name: 'createdBy' })
    userCreate: UserEntity;

    @ManyToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.updateOrderRefund)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: UserEntity;

    @OneToMany(
        () => OrderRefundStateEntity,
        (orderRefundStateEntity: OrderRefundStateEntity) => orderRefundStateEntity.refundRequest,
    )
    orderRefundStates: OrderRefundStateEntity[];

    @BeforeInsert()
    createExpire() {
        this.expiredAt = new Date(Date.now() + EXPIRE_REQUEST_MINUTES * 60 * 1000);
    }
}
