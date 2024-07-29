import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { CartProductEntity } from '../../cart-product/entity/cart-product.entity';
import { ProductBaseEntity } from '../../product-base/entity/product-base.entity';
import { ProductTypesEntity } from '../../product-types/entity/product-types.entity';

@Entity('cart_product_item')
export class CartProductItemEntity extends BaseEntity {
    @Column('uuid')
    productId: string;

    @Column('uuid', { nullable: true })
    productTypeId: string;

    @Column('integer')
    quantity: number;

    @Column('uuid')
    cartProductId: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @ManyToOne(() => CartProductEntity, (cartProductEntity: CartProductEntity) => cartProductEntity.products)
    @JoinColumn({ name: 'cartProductId' })
    cartProduct: CartProductEntity;

    @ManyToOne(() => ProductBaseEntity, (productBaseEntity: ProductBaseEntity) => productBaseEntity.cartProductItems)
    @JoinColumn({ name: 'productId' })
    product: ProductBaseEntity;

    @ManyToOne(
        () => ProductTypesEntity,
        (productTypesEntity: ProductTypesEntity) => productTypesEntity.cartProductItems,
        {
            nullable: true,
        },
    )
    @JoinColumn({ name: 'productTypeId' })
    productType: ProductTypesEntity;
}
