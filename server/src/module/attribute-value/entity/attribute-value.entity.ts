import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { AttributeEntity } from '../../attribute/entity/attribute.entity';
import { ProductTypesAttributeEntity } from '../../product-types-attribute/entity/product-types-attribute.entity';

@Entity('attribute_value')
export class AttributeValueEntity extends BaseEntity {
    @Column('text')
    value: string;

    @Column('uuid')
    attributeId: string;

    @ManyToOne(() => AttributeEntity)
    @JoinColumn({ name: 'attributeId' })
    attribute: AttributeEntity;

    @OneToMany(
        () => ProductTypesAttributeEntity,
        (productTypesAttributeEntity: ProductTypesAttributeEntity) => productTypesAttributeEntity.value,
    )
    productTypeAttribute: ProductTypesAttributeEntity;
}
