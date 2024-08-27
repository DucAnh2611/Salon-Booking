import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { OrderRefundStatusEnum } from '../../../common/enum/order.enum';
import { MediaEntity } from '../../media/entity/media.entity';
import { OrderRefundRequestEntity } from '../../oder-refund-request/entity/order-refund-request.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity('order_refund_state')
export class OrderRefundStateEntity extends BaseEntity {
    @Column('uuid')
    refundRequestId: string;

    @Column('uuid', { nullable: true })
    createdBy: string;

    @Column('enum', { enum: OrderRefundStatusEnum })
    status: OrderRefundStatusEnum;

    @Column('uuid', { nullable: true })
    mediaId: string;

    @Column('text', { nullable: true })
    bankTransactionCode: string;

    @Column('text', { nullable: true })
    note: string;

    @CreateDateColumn({ type: 'time with time zone' })
    createdAt: Date;

    @ManyToOne(() => MediaEntity, (mediaEntity: MediaEntity) => mediaEntity.orderRefundState, { nullable: true })
    @JoinColumn({ name: 'mediaId' })
    media: MediaEntity;

    @ManyToOne(
        () => OrderRefundRequestEntity,
        (orderRefundRequestEntity: OrderRefundRequestEntity) => orderRefundRequestEntity.orderRefundStates,
    )
    @JoinColumn({ name: 'refundRequestId' })
    refundRequest: OrderRefundRequestEntity;

    @ManyToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.createOrderRefundState)
    @JoinColumn({ name: 'createdBy' })
    userCreate: UserEntity;
}
