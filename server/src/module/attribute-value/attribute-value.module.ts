import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeValueService } from './attribute-value.service';
import { AttributeValueEntity } from './entity/attribute-value.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AttributeValueEntity])],
    providers: [AttributeValueService],
    exports: [AttributeValueService],
})
export class AttributeValueModule {}
