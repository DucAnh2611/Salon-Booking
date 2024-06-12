import { OTP_CHARACTER, OTP_MIXED, OTP_NUMBER } from '../../common/constant/otp.constant';

type OTPTypes = 'number' | 'mixed' | 'character';

export const generateOTP = ({ length = 6, type = 'number' }: { length?: number; type?: OTPTypes }) => {
    let otp: string = '';

    switch (type) {
        case 'number':
            for (let i = 0; i < length; i++) {
                otp += OTP_NUMBER[Math.floor(Math.random() * OTP_NUMBER.length)];
            }
            break;
        case 'mixed':
            for (let i = 0; i < length; i++) {
                otp += OTP_MIXED[Math.floor(Math.random() * OTP_MIXED.length)];
            }
            break;
        case 'character':
            for (let i = 0; i < length; i++) {
                otp += OTP_CHARACTER[Math.floor(Math.random() * OTP_CHARACTER.length)];
            }
            break;
        default:
            return '';
    }

    return otp;
};
