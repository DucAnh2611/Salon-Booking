import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { ServiceMediaModule } from '../service-media/service-media.module';
import { ServiceEntity } from './entity/service.entity';
import { ServiceBaseService } from './service-base.service';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceEntity]), CategoryModule, ServiceMediaModule],
    providers: [ServiceBaseService],
    exports: [ServiceBaseService],
})
export class ServiceBaseModule {}
