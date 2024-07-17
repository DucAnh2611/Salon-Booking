import { Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class ModifyEntity extends BaseEntity {
    @Column('uuid', { name: 'updatedBy', nullable: true })
    updatedBy: string;

    @Column('uuid', { name: 'createdBy', nullable: true })
    createdBy: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, type: 'timestamp with time zone' })
    deletedAt: Date;
}

export abstract class ModifyOnlyEntity {
    @Column('uuid', { name: 'updatedBy', nullable: true })
    updatedBy: string;

    @Column('uuid', { name: 'createdBy', nullable: true })
    createdBy: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}
