import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { CategoryEntity } from '../../category/entity/category.entity';
import { ClassificationEntity } from '../../classification/entity/classification.entity';
import { ProductMediaEntity } from '../../product-media/entity/product-media.entity';
import { ProductTypesAttributeEntity } from '../../product-types-attribute/entity/product-types-attribute.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { VoucherEntity } from '../../voucher/entity/voucher.entity';
import { MediaTypesEnum } from '../enum/media-types.enum';

@Entity('media')
export class MediaEntity extends ModifyEntity {
    @Column('varchar', { length: 255, nullable: false })
    path: string;

    @Column('text', { nullable: false })
    title: string;

    @Column('enum', { nullable: false, enum: MediaTypesEnum })
    type: MediaTypesEnum;

    @ManyToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.createMedia)
    @JoinColumn({ name: 'createdBy' })
    userCreate: UserEntity;

    @ManyToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.updateMedia)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: UserEntity;

    @OneToMany(() => UserEntity, (userEntity: UserEntity) => userEntity.userAvatar)
    userAvatar: UserEntity[];

    @OneToMany(() => VoucherEntity, (voucherEntity: VoucherEntity) => voucherEntity.voucherImage)
    voucherImage: VoucherEntity[];

    @OneToMany(() => CategoryEntity, (categoryEntity: CategoryEntity) => categoryEntity.image)
    categoryImage: CategoryEntity[];

    @OneToMany(() => ClassificationEntity, (classificationEntity: ClassificationEntity) => classificationEntity.image)
    classificationImage: ClassificationEntity[];

    @OneToMany(() => ProductMediaEntity, (productMediaEntity: ProductMediaEntity) => productMediaEntity.media)
    productMedia: ProductMediaEntity[];

    @OneToMany(
        () => ProductTypesAttributeEntity,
        (productTypesAttributeEntity: ProductTypesAttributeEntity) => productTypesAttributeEntity.thumbnail,
    )
    productTypesAttributeThumbnail: ProductTypesAttributeEntity[];
}
