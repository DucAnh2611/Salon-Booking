import { Body, Controller, Get, Post } from '@nestjs/common';
import { ROUTER, VIETQR_ROUTE } from '../../common/constant/router.constant';
import { BankService } from './bank.service';
import { BankCreateQuickLinkQRDto } from './dto/bank-create.dto';

@Controller(ROUTER.BANK)
export class BankController {
    constructor(private readonly bankService: BankService) {}

    @Get(VIETQR_ROUTE.BANK_LIST)
    getBankList() {
        return this.bankService.getBankList();
    }

    @Post(VIETQR_ROUTE.QUICK_QR)
    createQuickQr(@Body() body: BankCreateQuickLinkQRDto) {
        return this.bankService.createQrPayment(body);
    }
}
