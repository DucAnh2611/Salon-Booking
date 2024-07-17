import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { CartServiceItemEntity } from '../../cart-service-item/entity/cart-service-item.entity';
import { ClientEntity } from '../../client/entity/client.entity';

@Entity('cart_service')
export class CartServiceEntity extends BaseEntity {
    @Column('uuid')
    clientId: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @ManyToOne(() => ClientEntity, (clientEntity: ClientEntity) => clientEntity.cartService)
    @JoinColumn({ name: 'clientId' })
    client: ClientEntity;

    @OneToMany(
        () => CartServiceItemEntity,
        (cartServiceItemEntity: CartServiceItemEntity) => cartServiceItemEntity.cartService,
    )
    services: CartServiceItemEntity[];
}
