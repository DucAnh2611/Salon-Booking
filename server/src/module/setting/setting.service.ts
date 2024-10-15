import { Injectable } from '@nestjs/common';
import { SETTING_DEFAULT } from '../../common/constant/setting.constant';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { settingConfig } from '../../config/setting.config';
import { joinString } from '../../shared/utils/string';
import { EmployeeService } from '../employee/employee.service';
import { RedisService } from '../redis/redis.service';
import { SettingUpdateDto } from './dto/setting-update.dto';
import { Setting } from './interface/setting.interface';

@Injectable()
export class SettingService {
    constructor(
        private readonly redisService: RedisService,
        private readonly employeeService: EmployeeService,
    ) {}

    async update(employeeId: string, body: SettingUpdateDto) {
        await this.employeeService.isAdmin(employeeId);

        const {
            orderServiceConfirmTime,
            orderServiceConfirmUnit,
            otpEmailTime,
            otpEmailUnit,
            resetPasswordTime,
            resetPasswordUnit,
        } = body;

        const settingBody: Setting = {
            otpVerifyEmail: joinString({ joinString: '', strings: [otpEmailTime.toString(), otpEmailUnit] }),
            orderServiceConfirm: joinString({
                joinString: '',
                strings: [orderServiceConfirmTime.toString(), orderServiceConfirmUnit],
            }),
            resetPassword: joinString({ joinString: '', strings: [resetPasswordTime.toString(), resetPasswordUnit] }),
        };

        await this.redisService.set(settingConfig.name, settingBody);

        return DataSuccessCodeEnum.OK;
    }
    async reset(employeeId: string) {
        await this.employeeService.isAdmin(employeeId);

        await this.redisService.set(settingConfig.name, SETTING_DEFAULT);
        return DataSuccessCodeEnum.OK;
    }

    async get() {
        let cache = await this.redisService.get<Setting>(settingConfig.name);
        if (!cache) {
            await this.redisService.set(settingConfig.name, SETTING_DEFAULT);
            cache = SETTING_DEFAULT;
        }

        return cache;
    }
}
