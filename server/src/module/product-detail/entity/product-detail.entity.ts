import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { toSlug } from '../../../shared/utils/toSlug.utils';
import { ProductBaseEntity } from '../../product-base/entity/product-base.entity';

@Entity('product_detail')
export class ProductDetailEntity extends BaseEntity {
    @Column('text')
    key: string;

    @Column('text')
    slug: string;

    @Column('text')
    value: string;

    @Column('uuid')
    productId: string;

    @ManyToOne(() => ProductBaseEntity, (productBaseEntity: ProductBaseEntity) => productBaseEntity.productDetail)
    @JoinColumn({ name: 'productId' })
    product: ProductBaseEntity;

    @BeforeInsert()
    createSlug() {
        this.slug = toSlug(this.key);
    }

    @BeforeUpdate()
    updateSlug() {
        this.slug = toSlug(this.key);
    }
}
