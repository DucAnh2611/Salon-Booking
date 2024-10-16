import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProvinceBackupService } from './province-backup.service';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';

@Module({
    imports: [
        HttpModule.register({
            maxRedirects: 5,
            timeout: 1000,
        }),
    ],
    controllers: [ProvinceController],
    providers: [ProvinceService, ProvinceBackupService],
})
export class ProvinceModule {}
