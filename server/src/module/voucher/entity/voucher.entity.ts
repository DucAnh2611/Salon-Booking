import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { VoucherApplyTypeEnum, VoucherTypeEnum } from '../../../common/enum/voucher.enum';
import { ClientVoucherEnity } from '../../client-voucher/entity/client-voucher.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { MediaEntity } from '../../media/entity/media.entity';
import { VoucherClassificationEntity } from '../../voucher-classification/entity/voucher-classification.entity';

@Entity('voucher')
export class VoucherEntity extends ModifyEntity {
    @Column('uuid', { nullable: true })
    imageId: string;

    @Column('varchar', { nullable: false, unique: true })
    code: string;

    @Column('text')
    title: string;

    @Column('text')
    sDescription: string;

    @Column('text', { nullable: true })
    lDescription: string;

    @Column('enum', { enum: VoucherTypeEnum })
    type: VoucherTypeEnum;

    @Column('enum', { enum: VoucherApplyTypeEnum })
    applyType: VoucherApplyTypeEnum;

    @Column('integer')
    discount: number;

    @Column('integer')
    minAmount: number;

    @Column('integer')
    maxDiscount: number;

    @Column('timestamp', { default: new Date() })
    startAt: Date;

    @Column('timestamp', { default: new Date(), nullable: true })
    endAt: Date;

    @Column('integer', { nullable: true, default: null })
    usageLimit: number;

    @Column('boolean', { default: true })
    isActive: boolean;

    @OneToMany(() => ClientVoucherEnity, (clientVoucherEntity: ClientVoucherEnity) => clientVoucherEntity.voucher)
    clientVoucher: ClientVoucherEnity[];

    @ManyToOne(() => MediaEntity, (mediaEntity: MediaEntity) => mediaEntity.voucherImage, { eager: true })
    @JoinColumn({ name: 'imageId' })
    voucherImage: MediaEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createVoucher, { eager: true })
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateVoucher, { eager: true })
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;

    @OneToMany(
        () => VoucherClassificationEntity,
        (voucherClassificationEntity: VoucherClassificationEntity) => voucherClassificationEntity.voucher,
    )
    voucherClassification: VoucherClassificationEntity[];
}
