import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { resolve } from 'path';

export const mailerConfig: MailerOptions = {
    defaults: {
        from: `"Company" <${process.env.COMPANY_EMAIL}>`,
    },
    template: {
        dir: resolve(__dirname, '..', '..', '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
            extName: '.hbs',
            layoutsDir: resolve(__dirname, '..', '..', '..', 'templates'),
        },
    },
    transport: {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    },
};
