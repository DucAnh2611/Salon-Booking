import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartServiceItemModule } from '../cart-service-item/cart-service-item.module';
import { RoleModule } from '../role/role.module';
import { CartServiceController } from './cart-service.controller';
import { CartServiceService } from './cart-service.service';
import { CartServiceEntity } from './entity/cart-service.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CartServiceEntity]), CartServiceItemModule, RoleModule],
    controllers: [CartServiceController],
    providers: [CartServiceService],
    exports: [CartServiceService],
})
export class CartServiceModule {}
