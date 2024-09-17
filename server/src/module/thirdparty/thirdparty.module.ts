import { Module } from '@nestjs/common';
import { BankModule } from '../bank/bank.module';
import { ProvinceModule } from '../province/province.module';

@Module({
    imports: [ProvinceModule, BankModule],
})
export class ThirdPartyModule {}
