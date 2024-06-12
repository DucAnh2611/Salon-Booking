import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('client')
export class ClientEntity extends BaseEntity {
    @Column('text', { nullable: false })
    email: string;

    @Column('boolean', { default: false, nullable: false })
    emailVerified: boolean;

    @Column('boolean', { default: false, nullable: false })
    phoneVerified: boolean;

    @Column('uuid', { name: 'userId' })
    userId: string;

    @OneToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.employee)
    @JoinColumn({ name: 'userId' })
    userBase: UserEntity;
}
