import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeStatusEnum } from '../../../common/enum/employee.enum';
import { AttributeEntity } from '../../attribute/entity/attribute.entity';
import { CategoryEntity } from '../../category/entity/category.entity';
import { OrderServiceItemEntity } from '../../order-service-item/entity/order-service-item.entity';
import { ProductBaseEntity } from '../../product-base/entity/product-base.entity';
import { ProductTypesEntity } from '../../product-types/entity/product-types.entity';
import { RolePermissionEntity } from '../../role-permission/entity/role-permission.entity';
import { RoleEntity } from '../../role/entity/role.entity';
import { ServiceEntity } from '../../service-base/entity/service.entity';
import { ServiceEmpleeEntity } from '../../service-employee/entity/service-employee.entity';
import { ServiceStepEntity } from '../../service-step/entity/service-step.entity.entity';
import { ShiftEmployeeEntity } from '../../shift-employee/entity/shift-employee.entity';
import { ShiftEntity } from '../../shift/entity/shift.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { WorkingHourEntity } from '../../working-hour/entity/working-hour.entity';

@Entity('employee')
export class EmployeeEntity extends ModifyEntity {
    @Column('varchar', { unique: true, nullable: false })
    username: string;

    @Column('uuid', { name: 'userId' })
    userId: string;

    @Column('uuid')
    eRoleId: string;

    @Column('enum', { enum: EmployeeStatusEnum, nullable: true })
    status: EmployeeStatusEnum;

    @ManyToOne(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.userRole, { nullable: true })
    @JoinColumn({ name: 'eRoleId' })
    eRole: RoleEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEnitty: EmployeeEntity) => employeeEnitty.createEmployee, {
        nullable: true,
    })
    @JoinColumn({ name: 'createdBy' })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEnitty: EmployeeEntity) => employeeEnitty.updateEmployee)
    @JoinColumn({ name: 'updatedBy' })
    userUpdate: EmployeeEntity;

    @OneToMany(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.userCreate)
    createRole: RoleEntity[];

    @OneToMany(() => RoleEntity, (roleEntity: RoleEntity) => roleEntity.userUpdate)
    updateRole: RoleEntity[];

    @OneToMany(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.userCreate)
    createEmployee: EmployeeEntity[];

    @OneToMany(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.userUpdate)
    updateEmployee: EmployeeEntity[];

    @OneToMany(() => AttributeEntity, (attributeEntity: AttributeEntity) => attributeEntity.employeeCreate)
    createAttribute: AttributeEntity[];

    @OneToMany(() => AttributeEntity, (attributeEntity: AttributeEntity) => attributeEntity.employeeUpdate)
    updateAttribute: AttributeEntity[];

    @OneToMany(
        () => RolePermissionEntity,
        (rolePermisisonEntity: RolePermissionEntity) => rolePermisisonEntity.userCreate,
    )
    createRolePermission: RolePermissionEntity[];

    @OneToMany(() => CategoryEntity, (categoryEntity: CategoryEntity) => categoryEntity.userCreate)
    createCategory: CategoryEntity[];

    @OneToMany(() => ProductBaseEntity, (productBaseEntity: ProductBaseEntity) => productBaseEntity.userCreate)
    createProduct: ProductBaseEntity[];

    @OneToMany(() => ProductBaseEntity, (productBaseEntity: ProductBaseEntity) => productBaseEntity.userUpdate)
    updateProduct: ProductBaseEntity[];

    @OneToMany(() => ProductTypesEntity, (productTypesEntity: ProductTypesEntity) => productTypesEntity.userCreate)
    createProductTypes: ProductTypesEntity[];

    @OneToMany(() => ProductTypesEntity, (productTypesEntity: ProductTypesEntity) => productTypesEntity.userUpdate)
    updateProductTypes: ProductTypesEntity[];

    @OneToMany(() => ServiceEntity, (serviceEntity: ServiceEntity) => serviceEntity.userCreate)
    createService: ServiceEntity[];

    @OneToMany(() => ServiceEntity, (serviceEntity: ServiceEntity) => serviceEntity.userUpdate)
    updateService: ServiceEntity[];

    @OneToMany(
        () => ServiceEmpleeEntity,
        (serviceEmployeeEntity: ServiceEmpleeEntity) => serviceEmployeeEntity.userCreate,
    )
    createServiceEmployee: ServiceEmpleeEntity[];

    @OneToMany(
        () => ServiceEmpleeEntity,
        (serviceEmployeeEntity: ServiceEmpleeEntity) => serviceEmployeeEntity.userUpdate,
    )
    updateServiceEmployee: ServiceEmpleeEntity[];

    @OneToMany(
        () => ServiceEmpleeEntity,
        (serviceEmployeeEntity: ServiceEmpleeEntity) => serviceEmployeeEntity.employee,
    )
    serviceEmployee: ServiceEmpleeEntity[];

    @OneToMany(() => ServiceStepEntity, (serviceStepEntity: ServiceStepEntity) => serviceStepEntity.userCreate)
    createServiceStep: ServiceStepEntity[];

    @OneToMany(() => ServiceStepEntity, (serviceStepEntity: ServiceStepEntity) => serviceStepEntity.userUpdate)
    updateServiceStep: ServiceStepEntity[];

    @OneToMany(() => WorkingHourEntity, (workingHourEntity: WorkingHourEntity) => workingHourEntity.userCreate)
    createWorkingHour: WorkingHourEntity[];

    @OneToMany(() => WorkingHourEntity, (workingHourEntity: WorkingHourEntity) => workingHourEntity.userUpdate)
    updateWorkingHour: WorkingHourEntity[];

    @OneToMany(() => ShiftEntity, (shiftEntity: ShiftEntity) => shiftEntity.userCreate)
    createShift: ShiftEntity[];

    @OneToMany(() => ShiftEntity, (shiftEntity: ShiftEntity) => shiftEntity.userUpdate)
    updateShift: ShiftEntity[];

    @OneToMany(() => ShiftEmployeeEntity, (shiftEmployeeEntity: ShiftEmployeeEntity) => shiftEmployeeEntity.userCreate)
    createShiftEmployee: ShiftEmployeeEntity[];

    @OneToMany(() => ShiftEmployeeEntity, (shiftEmployeeEntity: ShiftEmployeeEntity) => shiftEmployeeEntity.userUpdate)
    updateShiftEmployee: ShiftEmployeeEntity[];

    @OneToMany(() => ShiftEmployeeEntity, (shiftEmployeeEntity: ShiftEmployeeEntity) => shiftEmployeeEntity.employee)
    assignShiftEmployee: ShiftEmployeeEntity[];

    @OneToMany(
        () => OrderServiceItemEntity,
        (orderServiceItemEntity: OrderServiceItemEntity) => orderServiceItemEntity.employee,
    )
    orderServiceItems: OrderServiceItemEntity[];

    @OneToMany(() => CategoryEntity, (categoryEntity: CategoryEntity) => categoryEntity.userUpdate)
    updateCategory: CategoryEntity[];

    @OneToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.employee, { eager: true })
    @JoinColumn({ name: 'userId' })
    userBase: UserEntity;
}
