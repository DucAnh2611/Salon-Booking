import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerAppModule } from '../mailer/mailer.module';
import { OrganizationModule } from '../organization/organization.module';
import { MailService } from './mail.service';

@Module({
    imports: [ConfigModule, MailerAppModule, OrganizationModule],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
