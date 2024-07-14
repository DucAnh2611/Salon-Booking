import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreateOnlyEntity } from '../../../common/enitty/create.entity';
import { ClassificationEntity } from '../../classification/entity/classification.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { VoucherEntity } from '../../voucher/entity/voucher.entity';

@Entity('voucher_classification')
export class VoucherClassificationEntity extends CreateOnlyEntity {
    @PrimaryColumn('uuid')
    voucherId: string;

    @PrimaryColumn('uuid')
    classificationId: string;

    @ManyToOne(() => VoucherEntity, (voucherEntity: VoucherEntity) => voucherEntity.voucherClassification, {
        eager: true,
    })
    @JoinColumn({ name: 'voucherId' })
    voucher: VoucherEntity;

    @ManyToOne(
        () => ClassificationEntity,
        (classificationEntity: ClassificationEntity) => classificationEntity.voucherClassification,
        { eager: true },
    )
    @JoinColumn({ name: 'classificationId' })
    classification: VoucherEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createVoucherClassification)
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;
}
