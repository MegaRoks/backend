import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    public async sendMailAboutMailConfirming(email: string, token: string) {
        const mail: ISendMailOptions = {
            to: email,
            from: process.env.COMPANY_EMAIL,
            subject: 'Confirmation email',
            template: 'confirmation-email',
            context: {
                token,
                url: process.env.CLIENT_URL,
            },
        };
        await this.sendMail(mail);
    }

    public async sendMailAboutPasswordChanging(email: string, token: string) {
        const mail: ISendMailOptions = {
            to: email,
            from: process.env.COMPANY_EMAIL,
            subject: 'Reset password',
            template: 'reset-password',
            context: {
                token,
                url: process.env.CLIENT_URL,
            },
        };
        await this.sendMail(mail);
    }

    public async sendMailAboutPasswordIsChanged(email: string) {
        const mail: ISendMailOptions = {
            to: email,
            from: process.env.COMPANY_EMAIL,
            subject: 'Changed password',
            template: 'changed-password',
        };
        await this.sendMail(mail);
    }

    public async sendMailAboutMailIsChanged(email: string) {
        const mail: ISendMailOptions = {
            to: email,
            from: process.env.COMPANY_EMAIL,
            subject: 'Changed email',
            template: 'changed-email',
        };
        await this.sendMail(mail);
    }

    private async sendMail(mail: ISendMailOptions) {
        await this.mailerService
            .sendMail(mail)
            .then((res) => console.log('res', res))
            .catch((error) => console.error('error', error));
    }
}
