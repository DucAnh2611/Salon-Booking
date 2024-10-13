import { Injectable } from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';
import { OrganizationService } from '../organization/service/organization.service';
import { MailActivationDto, MailResetPassword } from './dto/mail-activation.dto';
import { TEmailActivationContext, TEmailResetPasswordContext } from './types/mail-activation.type';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly organizationService: OrganizationService,
    ) {}

    async clientForgotPassword({ email, redirectURL, name, minutes }: MailResetPassword) {
        const currentOrganization = await this.organizationService.current();

        await this.mailerService.sendMail<TEmailResetPasswordContext>({
            templatePath: 'reset-password.hbs',
            context: {
                title: 'Đặt lại mật khẩu',
                app_name: currentOrganization.name || 'MySalon',
                name,
                minutes,
                redirectURL,
            },
            options: { to: email, subject: 'Đặt lại mật khẩu' },
        });
    }

    async clientVerifyEmail({ email, otp, name, redirectURL, minutes }: MailActivationDto) {
        const currentOrganization = await this.organizationService.current();

        await this.mailerService.sendMail<TEmailActivationContext>({
            templatePath: 'activation.hbs',
            context: {
                title: 'Xác minh email',
                app_name: currentOrganization.name || 'MySalon',
                name,
                otp,
                minutes,
                redirectURL,
            },
            options: { to: email, subject: 'Xác minh email' },
        });
    }
}
