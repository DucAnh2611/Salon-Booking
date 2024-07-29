import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from '../service-base/entity/service.entity';
import { CartServiceItemService } from './cart-service-item.service';
import { CartServiceItemEntity } from './entity/cart-service-item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CartServiceItemEntity, ServiceEntity])],
    providers: [CartServiceItemService],
    exports: [CartServiceItemService],
})
export class CartServiceItemModule {}
