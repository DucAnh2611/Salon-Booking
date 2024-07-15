import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { CategoryEntity } from '../../category/entity/category.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { ServiceEmpleeEntity } from '../../service-employee/entity/service-employee.entity';
import { ServiceMediaEntity } from '../../service-media/entity/service-media.entity';
import { ServiceStepEntity } from '../../service-step/entity/service-step.entity.entity';

@Entity('service')
export class ServiceEntity extends ModifyEntity {
    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('integer')
    duration: number;

    @Column('integer')
    price: number;

    @Column('uuid', { nullable: true })
    parentId: string;

    @Column('uuid')
    categoryId: string;

    @OneToMany(() => ServiceEntity, (serviceEntity: ServiceEntity) => serviceEntity.parent)
    children: ServiceEntity[];

    @OneToMany(() => ServiceMediaEntity, (serviceMediaEntity: ServiceMediaEntity) => serviceMediaEntity.service)
    media: ServiceMediaEntity[];

    @OneToMany(() => ServiceEmpleeEntity, (serviceEmployeeEntity: ServiceEmpleeEntity) => serviceEmployeeEntity.service)
    serviceEmployee: ServiceEmpleeEntity[];

    @OneToMany(() => ServiceStepEntity, (serviceStepEntity: ServiceStepEntity) => serviceStepEntity.service)
    steps: ServiceStepEntity[];

    @ManyToOne(() => ServiceEntity, (serviceEntity: ServiceEntity) => serviceEntity.children)
    @JoinColumn({ name: 'parentId' })
    parent: ServiceEntity;

    @ManyToOne(() => CategoryEntity, (categoryEntity: CategoryEntity) => categoryEntity.serviceCategory)
    @JoinColumn({ name: 'categoryId' })
    category: ServiceEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createService)
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateService)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;
}
