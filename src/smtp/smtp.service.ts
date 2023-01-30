import { MailerService } from '@nest-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SMTPService {
    constructor(private readonly mailerService: MailerService) {}

    async sendAdminRoleCode(to: string, adminCode: string): Promise<void> {
        await this.mailerService.sendMail({
            from: 'from@example.com',
            to,
            subject: '[MY SEOUL]Admin Code',
            template: 'give-admin',
            context: {
                adminCode
            }
        });
    }

    async sendEmailAuthenticateCode(to: string, authCode: string): Promise<void> {
        await this.mailerService.sendMail({
            from: 'from@example.com',
            to,
            subject: '[MY SEOUL]Authenticate Your Email',
            template: 'auth-email',
            context: {
                authCode
            }
        });
    }

    async sendNewPassword(to: string, tempPassword: string): Promise<void> {
        await this.mailerService.sendMail({
            from: 'from@example.com',
            to,
            subject: '[MY SEOUL]Reset Password',
            template: 'forgot-password',
            context: {
                tempPassword
            }
        });
    }
}
