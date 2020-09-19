import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { mailerConfig } from './mailer.config';
import { MailService } from './mail.service';

@Module({
    imports: [MailerModule.forRoot(mailerConfig)],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
