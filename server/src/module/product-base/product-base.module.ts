import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { MediaModule } from '../media/media.module';
import { ProductMediaEntity } from '../product-media/entity/product-media.entity';
import { ProductMediaModule } from '../product-media/product-media.module';
import { ProductTypesEntity } from '../product-types/entity/product-types.entity';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { ProductBaseAdminController } from './controller/product-base-admin.controller';
import { ProductBaseEntity } from './entity/product-base.entity';
import { ProductBaseService } from './product-base.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductBaseEntity, ProductTypesEntity, ProductMediaEntity]),
        ProductMediaModule,
        CategoryModule,
        MediaModule,
        RoleModule,
        RolePermissionModule,
    ],
    controllers: [ProductBaseAdminController],
    providers: [ProductBaseService],
    exports: [ProductBaseService],
})
export class ProductBaseModule {}
