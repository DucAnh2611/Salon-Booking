import { Column, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class UpdateEntity extends BaseEntity {
  @Column('uuid')
  updatedBy: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
