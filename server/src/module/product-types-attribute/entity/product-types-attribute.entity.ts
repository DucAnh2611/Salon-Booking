import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { AttributeValueEntity } from '../../attribute-value/entity/attribute-value.entity';
import { MediaEntity } from '../../media/entity/media.entity';
import { ProductTypesEntity } from '../../product-types/entity/product-types.entity';

@Index(['productTypesId', 'attributeValueId'])
@Entity('product_types_attribute')
export class ProductTypesAttributeEntity extends BaseEntity {
    @Column('uuid')
    productTypesId: string;

    @Column('integer', { default: 1 })
    level: number;

    @Column('uuid', { nullable: true })
    thumbnailId: string;

    @Column('uuid')
    attributeValueId: string;

    @ManyToOne(() => MediaEntity, (mediaEntity: MediaEntity) => mediaEntity.productTypesAttributeThumbnail, {
        eager: true,
    })
    @JoinColumn({ name: 'thumbnailId' })
    thumbnail: MediaEntity;

    @ManyToOne(
        () => ProductTypesEntity,
        (productTypesEntity: ProductTypesEntity) => productTypesEntity.productTypesAttribute,
    )
    @JoinColumn({ name: 'productTypesId' })
    productTypes: ProductTypesEntity;

    @ManyToOne(
        () => AttributeValueEntity,
        (attributeValueEntity: AttributeValueEntity) => attributeValueEntity.productTypeAttribute,
    )
    @JoinColumn({ name: 'attributeValueId' })
    value: AttributeValueEntity;
}
