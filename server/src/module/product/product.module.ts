import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { ProductBaseModule } from '../product-base/product-base.module';
import { ProductDetailModule } from '../product-detail/product-detail.module';
import { ProductMediaModule } from '../product-media/product-media.module';
import { ProductTypesAttributeModule } from '../product-types-attribute/product-types-attribute.module';
import { ProductTypesModule } from '../product-types/product-types.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { ServiceBaseModule } from '../service-base/service-base.module';
import { ProductAdminController } from './controller/product-admin.controller';
import { ProductClientController } from './controller/product.controller';
import { ProductClientService } from './service/product-client.service';
import { ProductService } from './service/product.service';

@Module({
    imports: [
        ProductBaseModule,
        ProductTypesModule,
        ProductMediaModule,
        ProductDetailModule,
        CategoryModule,
        ServiceBaseModule,
        ProductTypesAttributeModule,
        RoleModule,
        RolePermissionModule,
    ],
    controllers: [ProductAdminController, ProductClientController],
    providers: [ProductService, ProductClientService],
    exports: [ProductService, ProductClientService],
})
export class ProductModule {}
