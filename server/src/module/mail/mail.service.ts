import { Injectable } from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async signupSuccess({ email }: { email: string }) {
        await this.mailerService.sendMail({
            templatePath: '',
            context: { title: 'Signup successful', app_name: 'Salon Booking' },
            options: { to: email },
        });
    }
}
