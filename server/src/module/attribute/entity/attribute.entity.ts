import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { ProductTypesAttributeEntity } from '../../product-types-attribute/entity/product-types-attribute.entity';

@Entity('attribute')
export class AttributeEntity extends ModifyEntity {
    @Column('varchar', { length: 50 })
    name: string;

    @Column('text')
    description: string;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createAttribute)
    @JoinColumn({ name: 'createdBy' })
    employeeCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateAttribute)
    @JoinColumn({ name: 'updatedBy' })
    employeeUpdate: EmployeeEntity;

    @OneToMany(
        () => ProductTypesAttributeEntity,
        (productTypesAttributeEntity: ProductTypesAttributeEntity) => productTypesAttributeEntity.attribute,
    )
    productTypesAttribute: ProductTypesAttributeEntity[];
}
