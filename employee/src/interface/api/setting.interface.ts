export interface ISetting {
    otpVerifyEmail: string;
    orderServiceConfirm: string;
    resetPassword: string;
}

export interface ISettingUpdate {
    otpEmailTime: number;
    otpEmailUnit: string;

    orderServiceConfirmTime: number;
    orderServiceConfirmUnit: string;

    resetPasswordTime: number;
    resetPasswordUnit: string;
}
