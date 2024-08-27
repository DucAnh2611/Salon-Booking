import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { CategoryEntity } from '../../category/entity/category.entity';
import { OrderRefundStateEntity } from '../../order-refund-state/entity/order-refund-state.entity';
import { ProductMediaEntity } from '../../product-media/entity/product-media.entity';
import { ProductTypesAttributeEntity } from '../../product-types-attribute/entity/product-types-attribute.entity';
import { ServiceMediaEntity } from '../../service-media/entity/service-media.entity';
import { ServiceStepEntity } from '../../service-step/entity/service-step.entity.entity';
import { UserEntity } from '../../user/entity/user.entity';
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

    @OneToMany(() => CategoryEntity, (categoryEntity: CategoryEntity) => categoryEntity.image)
    categoryImage: CategoryEntity[];

    @OneToMany(() => ProductMediaEntity, (productMediaEntity: ProductMediaEntity) => productMediaEntity.media)
    productMedia: ProductMediaEntity[];

    @OneToMany(
        () => ProductTypesAttributeEntity,
        (productTypesAttributeEntity: ProductTypesAttributeEntity) => productTypesAttributeEntity.thumbnail,
    )
    productTypesAttributeThumbnail: ProductTypesAttributeEntity[];

    @OneToMany(() => ServiceMediaEntity, (serviceMediaEntity: ServiceMediaEntity) => serviceMediaEntity.media)
    serviceMedia: ServiceMediaEntity[];

    @OneToMany(() => ServiceStepEntity, (serviceStepEntity: ServiceStepEntity) => serviceStepEntity.thumbnail)
    stepThumbnail: ServiceStepEntity[];

    @OneToMany(
        () => OrderRefundStateEntity,
        (orderRefundStateEntity: OrderRefundStateEntity) => orderRefundStateEntity.media,
    )
    orderRefundState: OrderRefundStateEntity[];
}
