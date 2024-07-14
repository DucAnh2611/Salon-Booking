import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeModule } from '../attribute/attribute.module';
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
        AttributeModule,
        ProductBaseModule,
        RoleModule,
        RolePermissionModule,
        ProductTypesAttributeModule,
    ],
    controllers: [ProductTypesAdminController],
    providers: [ProductTypesService],
    exports: [ProductTypesService],
})
export class ProductTypesModule {}
