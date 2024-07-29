import { Module } from '@nestjs/common';
import { ProductBaseModule } from '../product-base/product-base.module';
import { ProductDetailModule } from '../product-detail/product-detail.module';
import { ProductMediaModule } from '../product-media/product-media.module';
import { ProductTypesAttributeModule } from '../product-types-attribute/product-types-attribute.module';
import { ProductTypesModule } from '../product-types/product-types.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { ProductAdminController } from './controller/product-admin.controller';
import { ProductService } from './product.service';

@Module({
    imports: [
        ProductBaseModule,
        ProductTypesModule,
        ProductMediaModule,
        ProductDetailModule,
        ProductTypesAttributeModule,
        RoleModule,
        RolePermissionModule,
    ],
    controllers: [ProductAdminController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
