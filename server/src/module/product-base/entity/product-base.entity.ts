import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { CartProductItemEntity } from '../../cart-product-item/entity/cart-product-item.entity';
import { CategoryEntity } from '../../category/entity/category.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { OrderProductItemEntity } from '../../order-product-item/entity/order-product-item.entity';
import { ProductDetailEntity } from '../../product-detail/entity/product-detail.entity';
import { ProductMediaEntity } from '../../product-media/entity/product-media.entity';
import { ProductTypesEntity } from '../../product-types/entity/product-types.entity';

@Entity('product')
export class ProductBaseEntity extends ModifyEntity {
    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('integer', { nullable: true })
    quantity: number;

    @Column('float', { nullable: true })
    price: number;

    @Column('varchar', { nullable: true, unique: true })
    sku: string;

    @Column('text')
    brand: string;

    @Column('uuid', { nullable: true })
    categoryId: string;

    @ManyToOne(() => CategoryEntity, (categoryEntity: CategoryEntity) => categoryEntity.productCategory, {
        eager: true,
    })
    @JoinColumn({ name: 'categoryId' })
    category: CategoryEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createProduct, { eager: true })
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateProduct, { eager: true })
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;

    @OneToMany(() => ProductTypesEntity, (productTypesEntity: ProductTypesEntity) => productTypesEntity.product, {
        eager: true,
    })
    types: ProductTypesEntity[];

    @OneToMany(() => ProductMediaEntity, (productMediaEntity: ProductMediaEntity) => productMediaEntity.product, {
        eager: true,
    })
    productMedia: ProductMediaEntity[];

    @OneToMany(() => ProductDetailEntity, (productDetailEntity: ProductDetailEntity) => productDetailEntity.product, {
        eager: true,
    })
    productDetail: ProductDetailEntity[];

    @OneToMany(
        () => CartProductItemEntity,
        (cartProductItemEntity: CartProductItemEntity) => cartProductItemEntity.product,
    )
    cartProductItems: CartProductItemEntity[];

    @OneToMany(
        () => OrderProductItemEntity,
        (orderProductItemEntity: OrderProductItemEntity) => orderProductItemEntity.product,
    )
    orderProductItems: OrderProductItemEntity[];
}
