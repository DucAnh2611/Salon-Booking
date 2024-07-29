import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { CartServiceEntity } from '../../cart-service/entity/cart-service.entity';
import { ServiceEntity } from '../../service-base/entity/service.entity';

@Entity('cart_service_item')
export class CartServiceItemEntity extends BaseEntity {
    @Column('uuid')
    serviceId: string;

    @Column('uuid')
    cartServiceId: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @ManyToOne(() => CartServiceEntity, (cartServiceEntity: CartServiceEntity) => cartServiceEntity.services)
    @JoinColumn({ name: 'cartServiceId' })
    cartService: CartServiceEntity;

    @ManyToOne(() => ServiceEntity, (serviceEntity: ServiceEntity) => serviceEntity.cartServiceItems)
    @JoinColumn({ name: 'serviceId' })
    service: ServiceEntity;
}
