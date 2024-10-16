import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const thirdPartyConfig = {
    backupProvice: env.THIRD_PARTY_BACKUP_PROVINCE,
    openProvince: env.THIRD_PARTY_OPEN_PROVINCE,
    vietQr: env.THIRD_PARTY_VIETQR,
    sePay: { urlQr: env.THIRD_PARTY_SEPAY_QR, urlMy: env.THIRD_PARTY_SEPAY_MY, api: env.THIRD_PARTY_SEPAY_API_KEY },
};
