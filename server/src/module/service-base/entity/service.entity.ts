import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { CartServiceItemEntity } from '../../cart-service-item/entity/cart-service-item.entity';
import { CategoryEntity } from '../../category/entity/category.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { OrderServiceItemEntity } from '../../order-service-item/entity/order-service-item.entity';
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

    @Column('uuid')
    categoryId: string;

    @OneToMany(() => ServiceMediaEntity, (serviceMediaEntity: ServiceMediaEntity) => serviceMediaEntity.service)
    media: ServiceMediaEntity[];

    @OneToMany(() => ServiceEmpleeEntity, (serviceEmployeeEntity: ServiceEmpleeEntity) => serviceEmployeeEntity.service)
    serviceEmployee: ServiceEmpleeEntity[];

    @OneToMany(() => ServiceStepEntity, (serviceStepEntity: ServiceStepEntity) => serviceStepEntity.service)
    steps: ServiceStepEntity[];

    @OneToMany(
        () => CartServiceItemEntity,
        (cartServiceItemEntity: CartServiceItemEntity) => cartServiceItemEntity.service,
    )
    cartServiceItems: CartServiceItemEntity[];

    @OneToMany(
        () => OrderServiceItemEntity,
        (orderServiceItemEntity: OrderServiceItemEntity) => orderServiceItemEntity.service,
    )
    orderServiceItems: OrderServiceItemEntity[];

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
