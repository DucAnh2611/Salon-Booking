import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { CategoryEntity } from '../../category/entity/category.entity';
import { UserEntity } from '../../user/entities/user.entity';
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
    userCreate: UserEntity;

    @ManyToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.updateMedia)
    userUpdate: UserEntity;

    @OneToMany(() => CategoryEntity, (categoryEntity: CategoryEntity) => categoryEntity.image)
    categoryImage: CategoryEntity;
}
