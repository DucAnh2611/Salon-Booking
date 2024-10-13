export type MailActivationDto = {
    email: string;
    otp: string;
    name: string;
    minutes: number;
    redirectURL?: string;
};

export type MailResetPassword = {
    email: string;
    name: string;
    minutes: number;
    redirectURL?: string;
};
