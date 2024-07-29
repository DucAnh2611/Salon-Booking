import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBaseModule } from '../product-base/product-base.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { ProductDetailAdminController } from './controller/product-detail-admin.controller';
import { ProductDetailEntity } from './entity/product-detail.entity';
import { ProductDetailService } from './product-detail.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductDetailEntity]), ProductBaseModule, RoleModule, RolePermissionModule],
    controllers: [ProductDetailAdminController],
    providers: [ProductDetailService],
    exports: [ProductDetailService],
})
export class ProductDetailModule {}
