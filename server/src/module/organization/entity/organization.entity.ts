import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { MediaEntity } from '../../media/entity/media.entity';

@Entity('organization')
export class OrganizationEntity extends ModifyEntity {
    @Column('boolean', { default: false })
    isShow: boolean;

    @Column('uuid')
    logoId: string;

    @Column('text')
    name: string;

    @Column('text')
    address: string;

    @Column('text')
    phone: string;

    @Column('text', { nullable: true, default: '' })
    gmail: string;

    @Column('text', { nullable: true, default: '' })
    facebook: string;

    @Column('text', { nullable: true, default: '' })
    instagram: string;

    @Column('text', { nullable: true, default: '' })
    zalo: string;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createOrganization)
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateOrganization)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;

    @ManyToOne(() => MediaEntity, () => (mediaEntity: MediaEntity) => mediaEntity.organization)
    @JoinColumn({ name: 'logoId' })
    logo: MediaEntity;
}
