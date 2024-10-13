export type TEmailBaseContext = {
    app_name: string;
    title: string;
};

export type TEmailActivationContext = TEmailBaseContext & {
    name: string;
    otp: string;
    minutes: number;
    redirectURL?: string;
};

export type TEmailResetPasswordContext = TEmailBaseContext & {
    name: string;
    minutes: number;
    redirectURL?: string;
};
