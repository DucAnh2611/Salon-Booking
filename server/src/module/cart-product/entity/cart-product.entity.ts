import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { CartProductItemEntity } from '../../cart-product-item/entity/cart-product-item.entity';
import { ClientEntity } from '../../client/entity/client.entity';

@Entity('cart_product')
export class CartProductEntity extends BaseEntity {
    @Column('uuid')
    clientId: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @ManyToOne(() => ClientEntity, (clientEntity: ClientEntity) => clientEntity.cartProduct)
    @JoinColumn({ name: 'clientId' })
    client: ClientEntity;

    @OneToMany(
        () => CartProductItemEntity,
        (cartProductItemEntity: CartProductItemEntity) => cartProductItemEntity.cartProduct,
    )
    products: CartProductItemEntity[];
}
