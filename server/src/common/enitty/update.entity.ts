import { Column, UpdateDateColumn } from 'typeorm';

export abstract class UpdateEntity {
  @Column('uuid')
  updatedBy: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
