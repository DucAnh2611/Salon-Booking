import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;

export const thirdPartyConfig = {
    openProvince: env.THIRD_PARTY_OPEN_PROVINCE,
    vietQr: env.THIRD_PARTY_VIETQR,
};
