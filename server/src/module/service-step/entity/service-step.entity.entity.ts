import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { MediaEntity } from '../../media/entity/media.entity';
import { ServiceEntity } from '../../service-base/entity/service.entity';

@Entity('service_step')
export class ServiceStepEntity extends ModifyEntity {
    @Column('uuid')
    serviceId: string;

    @Column('text')
    name: string;

    @Column('integer')
    step: number;

    @Column('text', { nullable: true })
    description: string;

    @Column('uuid', { nullable: true })
    thumbnailId: string;

    @ManyToOne(() => ServiceEntity, (serviceEntity: ServiceEntity) => serviceEntity.steps)
    @JoinColumn({ name: 'serviceId' })
    service: ServiceEntity;

    @ManyToOne(() => MediaEntity, (mediaEntity: MediaEntity) => mediaEntity.stepThumbnail)
    @JoinColumn({ name: 'thumbnailId' })
    thumbnail: MediaEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createServiceStep)
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateServiceStep)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;
}
