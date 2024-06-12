import { SendMailOptions } from 'nodemailer';

export type TSendMail<T extends object> = {
    templatePath: string;
    context: T;
    options: SendMailOptions;
};
