import { Module } from '@nestjs/common';
import { ProductBaseModule } from '../product-base/product-base.module';
import { ProductDetailModule } from '../product-detail/product-detail.module';
import { ProductMediaModule } from '../product-media/product-media.module';
import { ProductTypesAttributeModule } from '../product-types-attribute/product-types-attribute.module';
import { ProductTypesModule } from '../product-types/product-types.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';

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
})
export class ProductModule {}
