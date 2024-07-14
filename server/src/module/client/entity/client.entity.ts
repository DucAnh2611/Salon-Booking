import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { ClientVoucherEnity } from '../../client-voucher/entity/client-voucher.entity';
import { UserEntity } from '../../user/entity/user.entity';

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

    @OneToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.employee, { eager: true })
    @JoinColumn({ name: 'userId' })
    userBase: UserEntity;

    @OneToMany(() => ClientVoucherEnity, (clientVoucherEntity: ClientVoucherEnity) => clientVoucherEntity.client)
    clientVoucher: ClientVoucherEnity[];
}
