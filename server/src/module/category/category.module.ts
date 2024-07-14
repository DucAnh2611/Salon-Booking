import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { MediaEntity } from '../media/entity/media.entity';
import { MediaModule } from '../media/media.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entity/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity, MediaEntity]), RoleModule, RolePermissionModule, MediaModule],
    controllers: [CategoryController],
    providers: [CategoryService, AccessTokenGuard, UserTypeGuard, PermissionGuard],
    exports: [CategoryService],
})
export class CategoryModule {}
