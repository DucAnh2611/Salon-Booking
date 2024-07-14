import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeModule } from '../attribute/attribute.module';
import { MediaModule } from '../media/media.module';
import { ProductMediaEntity } from './entity/product-media.entity';
import { ProductMediaService } from './product-media.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductMediaEntity]), AttributeModule, MediaModule],
    controllers: [],
    providers: [ProductMediaService],
    exports: [ProductMediaService],
})
export class ProductMediaModule {}
