import { Injectable } from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';
import { MailActivationDto } from './dto/mail-activation.dto';
import { TEmailActivationContext } from './types/mail-activation.type';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async clientVerifyEmail({ email, otp, name, redirectURL, minutes }: MailActivationDto) {
        await this.mailerService.sendMail<TEmailActivationContext>({
            templatePath: 'activation.hbs',
            context: {
                title: 'Verify your email',
                app_name: 'Salon Booking',
                name,
                otp,
                minutes,
                redirectURL,
            },
            options: { to: email, subject: 'Verify your email' },
        });
    }
}
