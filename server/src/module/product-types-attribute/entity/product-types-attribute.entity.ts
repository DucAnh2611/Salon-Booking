import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { AttributeEntity } from '../../attribute/entity/attribute.entity';
import { MediaEntity } from '../../media/entity/media.entity';
import { ProductTypesEntity } from '../../product-types/entity/product-types.entity';

@Index(['productTypesId', 'attributeId'])
@Entity('product_types_attribute')
export class ProductTypesAttributeEntity extends BaseEntity {
    @PrimaryColumn('uuid')
    productTypesId: string;

    @PrimaryColumn('uuid')
    attributeId: string;

    @Column('varchar', { length: 20 })
    value: string;

    @Column('integer', { default: 1 })
    level: number;

    @Column('uuid', { nullable: true })
    thumbnailId: string;

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

    @ManyToOne(() => AttributeEntity, (attributeEntity: AttributeEntity) => attributeEntity.productTypesAttribute)
    @JoinColumn({ name: 'attributeId' })
    attribute: AttributeEntity;
}
