import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { AttributeValueEntity } from '../../attribute-value/entity/attribute-value.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';

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
        () => AttributeValueEntity,
        (attributeValueEntity: AttributeValueEntity) => attributeValueEntity.attribute,
    )
    attributeValue: AttributeValueEntity[];
}
