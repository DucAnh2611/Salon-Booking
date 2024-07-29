import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from '../media/media.module';
import { ServiceBaseModule } from '../service-base/service-base.module';
import { ServiceStepEntity } from './entity/service-step.entity.entity';
import { ServiceStepService } from './service-step.service';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceStepEntity]), ServiceBaseModule, MediaModule],
    providers: [ServiceStepService],
    exports: [ServiceStepService],
})
export class ServiceStepModule {}
