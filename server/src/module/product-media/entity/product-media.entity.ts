import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MediaEntity } from '../../media/entity/media.entity';
import { ProductBaseEntity } from '../../product-base/entity/product-base.entity';

@Entity('product_media')
export class ProductMediaEntity {
    @PrimaryColumn('uuid')
    mediaId: string;

    @PrimaryColumn('uuid')
    productId: string;

    @Column('boolean', { default: false })
    isThumbnail: boolean;

    @ManyToOne(() => MediaEntity, (mediaEntity: MediaEntity) => mediaEntity.productMedia, { eager: true })
    @JoinColumn({ name: 'mediaId' })
    media: MediaEntity;

    @ManyToOne(() => ProductBaseEntity, (productBaseEntity: ProductBaseEntity) => productBaseEntity.productMedia)
    @JoinColumn({ name: 'productId' })
    product: ProductBaseEntity;
}
