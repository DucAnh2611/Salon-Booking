import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/enitty/base.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { OrderEntity } from '../../order-base/entity/order-base.entity';
import { ServiceEntity } from '../../service-base/entity/service.entity';

@Entity('order_service_item')
export class OrderServiceItemEntity extends BaseEntity {
    @Column('uuid')
    orderId: string;

    @Column('uuid')
    serviceId: string;

    @Column('uuid')
    employeeId: string;

    @Column('jsonb')
    serviceSnapshot: object;

    @Column('jsonb')
    employeeSnapShot: object;

    @Column('timestamp with time zone')
    bookingDate: Date;

    @ManyToOne(() => OrderEntity, (orderEntity: OrderEntity) => orderEntity.services)
    @JoinColumn({ name: 'orderId' })
    order: OrderEntity;

    @ManyToOne(() => ServiceEntity, (serviceEntity: ServiceEntity) => serviceEntity.orderServiceItems)
    @JoinColumn({ name: 'serviceId' })
    service: ServiceEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.orderServiceItems)
    @JoinColumn({ name: 'employeeId' })
    employee: EmployeeEntity;
}
