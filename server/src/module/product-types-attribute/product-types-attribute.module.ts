import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeModule } from '../attribute/attribute.module';
import { MediaModule } from '../media/media.module';
import { ProductTypesAttributeEntity } from './entity/product-types-attribute.entity';
import { ProductTypesAttributeService } from './product-types-attribute.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductTypesAttributeEntity]), AttributeModule, MediaModule],
    providers: [ProductTypesAttributeService],
    exports: [ProductTypesAttributeService],
})
export class ProductTypesAttributeModule {}
