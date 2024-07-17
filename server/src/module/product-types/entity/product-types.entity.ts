import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { CartProductItemEntity } from '../../cart-product-item/entity/cart-product-item.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { OrderProductItemEntity } from '../../order-product-item/entity/order-product-item.entity';
import { ProductBaseEntity } from '../../product-base/entity/product-base.entity';
import { ProductTypesAttributeEntity } from '../../product-types-attribute/entity/product-types-attribute.entity';

@Entity('product_type')
export class ProductTypesEntity extends ModifyEntity {
    @Column('uuid')
    productId: string;

    @Column('integer')
    price: number;

    @Column('integer')
    quantity: number;

    @Column('varchar', { nullable: true })
    sku: string;

    @ManyToOne(() => ProductBaseEntity, (productEntity: ProductBaseEntity) => productEntity.types)
    @JoinColumn({ name: 'productId' })
    product: ProductBaseEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createProductTypes, {
        eager: true,
    })
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateProductTypes, {
        eager: true,
    })
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;

    @OneToMany(
        () => ProductTypesAttributeEntity,
        (productTypesAttributeEntity: ProductTypesAttributeEntity) => productTypesAttributeEntity.productTypes,
        { eager: true },
    )
    productTypesAttribute: ProductTypesAttributeEntity[];

    @OneToMany(
        () => CartProductItemEntity,
        (cartProductItemEntity: CartProductItemEntity) => cartProductItemEntity.productType,
    )
    cartProductItems: CartProductItemEntity[];

    @OneToMany(
        () => OrderProductItemEntity,
        (orderProductItemEntity: OrderProductItemEntity) => orderProductItemEntity.productType,
    )
    orderProductItems: OrderProductItemEntity[];
}
