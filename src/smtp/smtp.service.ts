import { MailerService } from '@nest-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SMTPService {
    constructor(private readonly mailerService: MailerService) {}

    async sendEmail(to: string, tempPassword: string): Promise<void> {
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
