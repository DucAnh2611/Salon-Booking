export interface IBank {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: number;
    lookupSupported: number;
}

export interface IBankQuickQr {
    code: string;
    desc: string;
    data: IQuickQr;
}

export interface IQuickQr {
    acpId?: number;
    accountName?: string;
    qrCode: string;
    qrDataURL: string;
}
