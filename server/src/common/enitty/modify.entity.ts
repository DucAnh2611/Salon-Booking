import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class ModifyEntity {
  @Column('uuid', { name: 'updatedBy' })
  updatedBy: string;

  @Column('uuid', { name: 'createdBy' })
  createdBy: string;

  @CreateDateColumn({ default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ default: new Date() })
  updatedAt: Date;
}
