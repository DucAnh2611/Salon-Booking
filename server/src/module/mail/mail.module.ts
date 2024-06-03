import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerAppModule } from '../mailer/mailer.module';
import { MailService } from './mail.service';

@Module({
    imports: [ConfigModule, MailerAppModule],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
