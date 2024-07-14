import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { MediaEntity } from '../../media/entity/media.entity';
import { VoucherClassificationEntity } from '../../voucher-classification/entity/voucher-classification.entity';

@Entity('classification')
export class ClassificationEntity extends ModifyEntity {
    @Column('text')
    name: string;

    @Column('integer')
    minSpend: number;

    @Column('integer')
    maxSpend: number;

    @Column('uuid', { nullable: true, default: null })
    imageId: string;

    @ManyToOne(() => MediaEntity, (mediaEntity: MediaEntity) => mediaEntity.classificationImage, { eager: true })
    @JoinColumn({ name: 'imageId' })
    image: MediaEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createClassification, {
        eager: true,
    })
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateClassification, {
        eager: true,
    })
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;

    @OneToMany(
        () => VoucherClassificationEntity,
        (voucherClassificationEntity: VoucherClassificationEntity) => voucherClassificationEntity.classification,
    )
    voucherClassification: VoucherClassificationEntity[];
}
