import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { THIRD_PARTY_SEPAY, THIRD_PARTY_VIETQR } from '../../common/constant/router-third-party';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import {
    Bank,
    BankListApi,
    BankPaymentQrSePay,
    BankTransactionListApi,
    SePayTransaction,
} from '../../common/interface/bank.interface';
import { thirdPartyConfig } from '../../config/third-party';
import { joinString } from '../../shared/utils/string';
import { RedisService } from '../redis/redis.service';
import { WebhookRefundResultDto } from '../webhook/dto/webhook-post.dto';
import { BankCreateQuickLinkQRDto } from './dto/bank-create.dto';
import { TransactionRefund } from './dto/bank-get.dto';

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
            {
                baseURL: thirdPartyConfig.vietQr,
            },
        );

        const res = await firstValueFrom(request);

        list = res.data;

        this.redisService.set(this.keyRedis, res.data, 1000 * 60 * 60);

        return list;
    }

    async createQrPayment(body: BankCreateQuickLinkQRDto) {
        const { amount, bankAccount, bankCode, desc, code } = body;

        const redisCheck = (await this.redisService.get(
            `${bankCode}_${bankAccount}_${amount}`,
        )) as BankPaymentQrSePay | null;
        if (redisCheck) {
            const refundTransaction = await this.redisService.get<WebhookRefundResultDto | undefined>(code);

            return { ...redisCheck, ...(refundTransaction ? { referenceCode: refundTransaction.referenceCode } : {}) };
        }

        const qrLink = joinString({
            joinString: '?',
            strings: [
                joinString({
                    joinString: '/',
                    strings: [thirdPartyConfig.sePay.urlQr, THIRD_PARTY_SEPAY.PAYMENT_QR],
                }),
                joinString({
                    joinString: '&',
                    strings: [
                        `acc=${bankAccount}`,
                        `bank=${bankCode}`,
                        `amount=${amount}`,
                        `des=${joinString({ joinString: ' ', strings: [`[${code}]`, desc] })}`,
                        `template=compact`,
                    ],
                }),
            ],
        });

        this.redisService.set(`${bankCode}_${bankAccount}_${amount}`, { qrLink }, 60 * 60 * 1000);

        return { qrLink };
    }

    async removeRefundTransaction(code: string) {
        await this.redisService.del(code);
        return DataSuccessCodeEnum.OK;
    }

    getRefundTransaction(code: string) {
        return this.redisService.get<{
            code: string;
            referenceCode: string;
        } | null>(code);
    }

    async getTransactionReference(body: TransactionRefund) {
        const request = this.createRequest<BankTransactionListApi>(
            'get',
            joinString({
                joinString: '?',
                strings: [
                    THIRD_PARTY_SEPAY.TRANSACTION_LIST,
                    joinString({
                        joinString: '&',
                        strings: Object.entries(body).map(([key, value]) => `${key}=${value}`),
                    }),
                ],
            }),
            {
                baseURL: thirdPartyConfig.sePay.urlMy,
                headers: {
                    Authorization: joinString({ joinString: ' ', strings: ['Bearer', thirdPartyConfig.sePay.api] }),
                    'Content-Type': 'application/json',
                },
            },
        );
        const res = await firstValueFrom(request);

        const transactionList: SePayTransaction[] = res.transactions;

        return transactionList;
    }

    async removeQr(name: string) {
        const redisCheck = (await this.redisService.get(name)) as BankPaymentQrSePay | null;
        if (!redisCheck) return;

        await this.redisService.del(name);
    }

    async getBankFromBin(bin: number) {
        const bankList = await this.getBankList();

        return bankList.find(item => parseInt(item.bin) === bin);
    }
}
