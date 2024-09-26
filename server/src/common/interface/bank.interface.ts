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

export interface BankQuickQrApi {
    code: string;
    desc: string;
    data: QuickQr;
}

export interface QuickQr {
    acpId?: number;
    accountName?: string;
    qrCode: string;
    qrDataURL: string;
}
