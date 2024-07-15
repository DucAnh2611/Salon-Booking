import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ModifyOnlyEntity } from '../../../common/enitty/modify.entity';
import { ServiceEmployeeExperienceEnum } from '../../../common/enum/service.enum';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { ServiceEntity } from '../../service-base/entity/service.entity';

@Entity('service_employee')
export class ServiceEmpleeEntity extends ModifyOnlyEntity {
    @PrimaryColumn('uuid')
    serviceId: string;

    @PrimaryColumn('uuid')
    employeeId: string;

    @Column('enum', { enum: ServiceEmployeeExperienceEnum, default: ServiceEmployeeExperienceEnum.BEGINNER })
    experience: ServiceEmployeeExperienceEnum;

    @ManyToOne(() => ServiceEntity, (serviceEntity: ServiceEntity) => serviceEntity.serviceEmployee)
    @JoinColumn({ name: 'serviceId' })
    service: ServiceEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.serviceEmployee)
    @JoinColumn({ name: 'employeeId' })
    employee: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createServiceEmployee)
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateServiceEmployee)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;
}
