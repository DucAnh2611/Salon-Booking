export type TEmailBaseContext = {
    title: string;
};

export type TEmailActivationContext = TEmailBaseContext & {
    app_name: string;
    name: string;
    otp: string;
    redirectURL?: string;
};
