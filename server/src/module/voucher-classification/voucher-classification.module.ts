import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherClassificationEntity } from './entity/voucher-classification.entity';

@Module({
    imports: [TypeOrmModule.forFeature([VoucherClassificationEntity])],
})
export class VoucherClassificationModule {}
