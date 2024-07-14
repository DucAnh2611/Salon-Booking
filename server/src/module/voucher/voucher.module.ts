import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenGuard } from '../../shared/guard/accessToken.guard';
import { PermissionGuard } from '../../shared/guard/permission.guard';
import { UserTypeGuard } from '../../shared/guard/user-type.guard';
import { MediaModule } from '../media/media.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { VoucherAdminController } from './controller/voucher-admin.controller';
import { VoucherController } from './controller/voucher.controller';
import { VoucherEntity } from './entity/voucher.entity';
import { VoucherService } from './voucher.service';

@Module({
    imports: [TypeOrmModule.forFeature([VoucherEntity]), RoleModule, RolePermissionModule, MediaModule],
    controllers: [VoucherController, VoucherAdminController],
    providers: [VoucherService, AccessTokenGuard, PermissionGuard, UserTypeGuard],
    exports: [],
})
export class VoucherModule {}
