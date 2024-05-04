import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class ModifyEntity extends BaseEntity {
  @Column('uuid', { name: 'updatedBy' })
  updatedBy: string;

  @Column('uuid', { name: 'createdBy' })
  createdBy: string;

  @CreateDateColumn({ default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ default: new Date() })
  updatedAt: Date;
}
