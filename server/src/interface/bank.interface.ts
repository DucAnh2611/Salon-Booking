export interface BankListApi {
    code: string;
    desc: string;
    data: Bank[];
}

export interface Bank {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: number;
    lookupSupported: number;
}

export interface BankTransactionListApi {
    status: number;
    error: string | null;
    message: {
        success: boolean;
    };
    transactions: SePayTransaction[];
}

export interface BankQuickQrApi {
    code: string;
    desc: string;
    data: QuickQr;
}

export type BankPaymentQrSePay = {
    qrLink: string;
};
export interface QuickQr {
    acpId?: number;
    accountName?: string;
    qrCode: string;
    qrDataURL: string;
}

export interface SePayTransaction {
    id: string;
    bank_brand_name: string;
    account_number: string;
    transaction_date: string;
    amount_out: string;
    amount_in: string;
    accumulated: string;
    transaction_content: string;
    reference_number: string;
    code: any;
    sub_account: any;
    bank_account_id: string;
}
