import { Exclude, Expose } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { DEFAULT_VALUE_ENTITY } from '../../../common/constant/entity.constant';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { GenderEnum } from '../../../common/enum/gender.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { HashPasswordUtil } from '../../../shared/utils/hash-password.utils';
import { ClientEntity } from '../../client/entity/client.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { MediaEntity } from '../../media/entity/media.entity';
import { OrderRefundRequestEntity } from '../../oder-refund-request/entity/order-refund-request.entity';
import { OrderEntity } from '../../order-base/entity/order-base.entity';
import { OrderRefundStateEntity } from '../../order-refund-state/entity/order-refund-state.entity';
import { OrderStateEntity } from '../../order-state/entity/order-state.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
    @Column('date', { nullable: false, default: DEFAULT_VALUE_ENTITY.birthday })
    birthday: Date;

    @Column('enum', { nullable: false, enum: GenderEnum })
    gender: GenderEnum;

    @Expose({ groups: ['auth'] })
    @Exclude()
    @Column('text', { nullable: false })
    password: string;

    @Column('varchar', { length: 100, nullable: false })
    firstname: string;

    @Column('varchar', { length: 100, nullable: false })
    lastname: string;

    @Column('enum', { enum: UserTypeEnum, default: UserTypeEnum[UserTypeEnum.CLIENT] })
    type: UserTypeEnum;

    @Column('text', { nullable: false })
    phone: string;

    @Column('uuid', { nullable: true })
    avatar: string;

    @OneToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.userBase, { nullable: true })
    employee: EmployeeEntity;

    @OneToOne(() => ClientEntity, (clientEntity: ClientEntity) => clientEntity.userBase, { nullable: true })
    client: ClientEntity;

    @OneToMany(() => MediaEntity, (mediaEntity: MediaEntity) => mediaEntity.userCreate, { nullable: true })
    createMedia: MediaEntity[];

    @OneToMany(() => MediaEntity, (mediaEntity: MediaEntity) => mediaEntity.userUpdate, { nullable: true })
    updateMedia: MediaEntity[];

    @OneToMany(() => OrderStateEntity, (orderStateEntity: OrderStateEntity) => orderStateEntity.userCreate)
    createOrderState: OrderStateEntity[];

    @OneToMany(
        () => OrderRefundRequestEntity,
        (orderRefundRequestEntity: OrderRefundRequestEntity) => orderRefundRequestEntity.userUpdate,
    )
    createOrderRefund: OrderRefundRequestEntity[];

    @OneToMany(
        () => OrderRefundRequestEntity,
        (orderRefundRequestEntity: OrderRefundRequestEntity) => orderRefundRequestEntity.userUpdate,
    )
    updateOrderRefund: OrderRefundRequestEntity[];

    @OneToMany(
        () => OrderRefundStateEntity,
        (orderRefundStateEntity: OrderRefundStateEntity) => orderRefundStateEntity.userCreate,
    )
    createOrderRefundState: OrderRefundStateEntity[];

    @OneToMany(() => OrderEntity, (orderEntity: OrderEntity) => orderEntity.userUpdate)
    createOrder: OrderEntity[];

    @OneToMany(() => OrderEntity, (orderEntity: OrderEntity) => orderEntity.userCreate)
    updateOrder: OrderEntity[];

    @ManyToOne(() => MediaEntity, (mediaEntity: MediaEntity) => mediaEntity.userAvatar)
    @JoinColumn({ name: 'avatar' })
    userAvatar: MediaEntity;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await HashPasswordUtil.hashPassword(this.password);
        }
    }
}
