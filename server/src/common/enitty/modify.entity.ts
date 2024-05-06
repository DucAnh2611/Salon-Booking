import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class ModifyEntity extends BaseEntity {
  @Column('uuid', { name: 'updatedBy', nullable: true })
  updatedBy: string;

  @Column('uuid', { name: 'createdBy', nullable: true })
  createdBy: string;

  @CreateDateColumn({ default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ default: new Date() })
  updatedAt: Date;
}

export abstract class ModifyOnlyEntity {
  @Column('uuid', { name: 'updatedBy', nullable: true })
  updatedBy: string;

  @Column('uuid', { name: 'createdBy', nullable: true })
  createdBy: string;

  @CreateDateColumn({ default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ default: new Date() })
  updatedAt: Date;
}
