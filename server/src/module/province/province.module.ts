import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';

@Module({
    imports: [
        HttpModule.register({
            maxRedirects: 5,
            timeout: 5000,
        }),
    ],
    controllers: [ProvinceController],
    providers: [ProvinceService],
})
export class ProvinceModule {}
