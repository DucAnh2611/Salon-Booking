import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { OrderStatusEnum } from '../../../common/enum/order.enum';
import { OrderEntity } from '../../order-base/entity/order-base.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity('order_state')
export class OrderStateEntity extends BaseEntity {
    @Column('enum', { enum: OrderStatusEnum })
    state: OrderStatusEnum;

    @Column('uuid')
    orderId: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('uuid')
    createdBy: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @ManyToOne(() => OrderEntity, (orderEntity: OrderEntity) => orderEntity.orderState)
    @JoinColumn({ name: 'orderId' })
    order: OrderEntity;

    @ManyToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.createOrderState)
    @JoinColumn({ name: 'createdBy' })
    userCreate: UserEntity;
}
