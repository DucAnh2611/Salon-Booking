import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from '../media/media.module';
import { ServiceMediaEntity } from './entity/service-media.entity';
import { ServiceMediaService } from './service-media.service';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceMediaEntity]), MediaModule],
    providers: [ServiceMediaService],
    exports: [ServiceMediaService],
})
export class ServiceMediaModule {}
