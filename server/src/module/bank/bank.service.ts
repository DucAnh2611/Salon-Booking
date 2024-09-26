import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { THIRD_PARTY_VIETQR } from '../../common/constant/router-third-party';
import { Bank, BankListApi, BankQuickQrApi } from '../../common/interface/bank.interface';
import { thirdPartyConfig } from '../../config/third-party';
import { joinString } from '../../shared/utils/string';
import { RedisService } from '../redis/redis.service';
import { BankCreateQuickLinkQRDto } from './dto/bank-create.dto';

@Injectable()
export class BankService {
    private readonly keyRedis = 'bank_list_salon_booking';
    constructor(
        private readonly httpService: HttpService,
        private readonly redisService: RedisService,
    ) {}

    createRequest<T>(method: string, url: string, config?: AxiosRequestConfig) {
        return this.httpService
            .request<T>({
                method,
                url,
                baseURL: thirdPartyConfig.vietQr,
                ...config,
            })
            .pipe(map(response => response.data));
    }

    async getBankList() {
        const inCache = (await this.redisService.get(this.keyRedis)) as Bank[];

        if (inCache) {
            return inCache;
        }
        let list: Bank[] = [];
        const request = this.createRequest<BankListApi>(
            'get',
            joinString({
                joinString: '/',
                strings: [THIRD_PARTY_VIETQR.BANKS],
            }),
        );

        const res = await firstValueFrom(request);

        list = res.data;

        this.redisService.set(this.keyRedis, res.data, 1000 * 60 * 60);

        return list;
    }

    async createQrPayment(body: BankCreateQuickLinkQRDto) {
        const { amount, bankAccount, bankBin, desc, bankName } = body;

        const redisCheck = (await this.redisService.get(
            `${bankBin}_${bankAccount}_${bankName}_${amount}`,
        )) as BankQuickQrApi | null;
        if (redisCheck) {
            return redisCheck.data;
        }

        const request = this.createRequest<BankQuickQrApi>(
            'post',
            joinString({
                joinString: '/',
                strings: [THIRD_PARTY_VIETQR.QUICK_QR],
            }),
            {
                data: {
                    accountNo: bankAccount,
                    accountName: bankName,
                    acqId: bankBin,
                    addInfo: desc,
                    amount: amount,
                    format: 'text',
                    template: 'compact',
                },
            },
        );

        const res = await firstValueFrom(request);
        this.redisService.set(`${bankBin}_${bankAccount}_${bankName}_${amount}`, res, 60 * 60 * 1000);

        return res.data;
    }

    async removeQr(name: string) {
        const redisCheck = (await this.redisService.get(name)) as BankQuickQrApi | null;
        if (!redisCheck) return;

        await this.redisService.del(name);
    }

    async getBankFromBin(bin: number) {
        const bankList = await this.getBankList();

        return bankList.find(item => parseInt(item.bin) === bin);
    }
}
