import { SendMailOptions } from 'nodemailer';

export type TSendMail = {
    templatePath: string;
    context: object;
    options: SendMailOptions;
};
