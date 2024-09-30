export type MailActivationDto = {
    email: string;
    otp: string;
    name: string;
    minutes: number;
    redirectURL?: string;
};
