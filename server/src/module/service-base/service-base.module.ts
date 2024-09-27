import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { OrderServiceItemEntity } from '../order-service-item/entity/order-service-item.entity';
import { ServiceMediaModule } from '../service-media/service-media.module';
import { ServiceStepEntity } from '../service-step/entity/service-step.entity.entity';
import { ServiceEntity } from './entity/service.entity';
import { ServiceBaseService } from './service-base.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ServiceEntity, ServiceStepEntity, OrderServiceItemEntity]),
        CategoryModule,
        ServiceMediaModule,
    ],
    providers: [ServiceBaseService],
    exports: [ServiceBaseService],
})
export class ServiceBaseModule {}
