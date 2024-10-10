import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { TSendMail } from '../../common/type/mail.type';
import { mailerConfig, TEMPLATE_PATH } from '../../config/mailer.config';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transport;

    constructor() {
        this.defaultTransporter();
    }

    private defaultTransporter() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: mailerConfig.host,
            port: mailerConfig.port,
            pool: true,
            ignoreTLS: mailerConfig.ignoreTLS,
            secure: mailerConfig.secure,
            requireTLS: mailerConfig.requireTLS,
            auth: {
                user: mailerConfig.user,
                pass: mailerConfig.password,
            },
        });

        return this;
    }

    setTransporter(transport?: string | SMTPTransport | SMTPTransport.Options, defaults?: SMTPTransport.Options) {
        this.transporter = nodemailer.createTransport(transport, defaults);
        return this;
    }

    async sendMail<T extends object>({ templatePath, context, options }: TSendMail<T>): Promise<MailerService> {
        const template = this.readHbs({ src: TEMPLATE_PATH + templatePath });
        const html = Handlebars.compile(template, {
            strict: true,
        })(context);

        await this.transporter.sendMail({
            ...options,
            html,
        });

        return this;
    }

    readHbs({ src }: { src: string }) {
        try {
            const file = fs.readFileSync(src, { encoding: 'utf-8' });
            return file;
        } catch (err) {
            return fs.readFileSync(mailerConfig.defaultTemplate, { encoding: 'utf-8' });
        }
    }
}
