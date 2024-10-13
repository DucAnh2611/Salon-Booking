import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingModule } from '../setting/setting.module';
import { OrderEntity } from './entity/order-base.entity';
import { OrderBaseService } from './order-base.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity]), SettingModule],
    providers: [OrderBaseService],
    exports: [OrderBaseService],
})
export class OrderBaseModule {}
