import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ModifyEntity } from '../../../common/enitty/modify.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { MediaEntity } from '../../media/entity/media.entity';

@Entity('category')
export class CategoryEntity extends ModifyEntity {
    @Column('integer', { nullable: false, default: 1 })
    level: number;

    @Column('text', { nullable: false })
    title: string;

    @Column('uuid', { nullable: true })
    imageId: string;

    @Column('uuid', { nullable: true })
    parentId: string;

    @OneToMany(() => CategoryEntity, (categoryEntity: CategoryEntity) => categoryEntity.parent, { eager: true })
    childrens: CategoryEntity[];

    @ManyToOne(() => CategoryEntity, (categoryEntity: CategoryEntity) => categoryEntity.childrens, {
        nullable: true,
    })
    @JoinColumn({ name: 'parentId' })
    parent: CategoryEntity;

    @ManyToOne(() => MediaEntity, (mediaEntity: MediaEntity) => mediaEntity.categoryImage, { eager: true })
    @JoinColumn({ name: 'imageId' })
    image: MediaEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.createCategory, { eager: true })
    userCreate: EmployeeEntity;

    @ManyToOne(() => EmployeeEntity, (employeeEntity: EmployeeEntity) => employeeEntity.updateCategory, { eager: true })
    userUpdate: EmployeeEntity;
}
