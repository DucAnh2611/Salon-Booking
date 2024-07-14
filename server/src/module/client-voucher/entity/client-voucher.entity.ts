import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ClientEntity } from '../../client/entity/client.entity';
import { VoucherEntity } from '../../voucher/entity/voucher.entity';

@Entity('client_voucher')
export class ClientVoucherEnity extends BaseEntity {
    @PrimaryColumn('uuid')
    voucherId: string;

    @PrimaryColumn('uuid')
    clientId: string;

    @CreateDateColumn()
    savedAt: Date;

    @Column('integer', { nullable: false, default: 1 })
    quantity: number;

    @Column('boolean', { default: true })
    isActive: boolean;

    @ManyToOne(() => ClientEntity)
    @JoinColumn({ name: 'voucherId' })
    client: ClientEntity;

    @ManyToOne(() => VoucherEntity)
    @JoinColumn({ name: 'clientId' })
    voucher: VoucherEntity;
}
