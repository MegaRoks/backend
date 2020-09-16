import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { mailerConfig } from './mailer.config';

@Module({
    imports: [MailerModule.forRoot(mailerConfig)],
})
export class MailModule {}
