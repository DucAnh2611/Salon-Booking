export type MailActivationDto = {
    email: string;
    otp: string;
    name: string;
    redirectURL?: string;
};
