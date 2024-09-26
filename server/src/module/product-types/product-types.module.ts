import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeValueModule } from '../attribute-value/attribute-value.module';
import { ProductBaseModule } from '../product-base/product-base.module';
import { ProductTypesAttributeModule } from '../product-types-attribute/product-types-attribute.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { ProductTypesAdminController } from './controller/product-types-admin.controller';
import { ProductTypesEntity } from './entity/product-types.entity';
import { ProductTypesService } from './product-types.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductTypesEntity]),
        ProductBaseModule,
        RoleModule,
        RolePermissionModule,
        ProductTypesAttributeModule,
        AttributeValueModule,
    ],
    controllers: [ProductTypesAdminController],
    providers: [ProductTypesService],
    exports: [ProductTypesService],
})
export class ProductTypesModule {}
