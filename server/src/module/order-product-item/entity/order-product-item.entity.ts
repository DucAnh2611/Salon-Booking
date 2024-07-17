import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { OrderEntity } from '../../order-base/entity/order-base.entity';
import { ProductBaseEntity } from '../../product-base/entity/product-base.entity';
import { ProductTypesEntity } from '../../product-types/entity/product-types.entity';

@Entity('order_product_item')
export class OrderProductItemEntity extends BaseEntity {
    @Column('uuid')
    orderId: string;

    @Column('uuid')
    productId: string;

    @Column('uuid', { nullable: true })
    productTypeId: string;

    @Column('jsonb')
    productSnapshot: object;

    @Column('jsonb', { nullable: true })
    productTypeSnapshot: object;

    @Column('integer')
    quantity: number;

    @Column('integer')
    unitPrice: number;

    @Column('integer')
    totalPrice: number;

    @ManyToOne(() => OrderEntity, (orderEntity: OrderEntity) => orderEntity.products)
    @JoinColumn({ name: 'orderId' })
    order: OrderEntity;

    @ManyToOne(() => ProductBaseEntity, (productBaseEntity: ProductBaseEntity) => productBaseEntity.orderProductItems)
    @JoinColumn({ name: 'productId' })
    product: OrderEntity;

    @ManyToOne(
        () => ProductTypesEntity,
        (productTypesEntity: ProductTypesEntity) => productTypesEntity.orderProductItems,
        { nullable: true },
    )
    @JoinColumn({ name: 'productTypeId' })
    productType: OrderEntity;
}
