import { Column, CreateDateColumn } from 'typeorm';

export abstract class CreateEntity {
  @Column('uuid')
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
