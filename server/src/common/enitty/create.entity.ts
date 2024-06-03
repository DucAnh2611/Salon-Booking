import { Column, CreateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class CreateEntity extends BaseEntity {
    @Column('uuid')
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;
}

export abstract class CreateOnlyEntity {
    @Column('uuid')
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;
}
