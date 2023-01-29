import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SMTPService } from './smtp.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (cs: ConfigService) => ({
                transport: {
                    host: 'smtp.mailtrap.io',
                    port: 2525,
                    auth: {
                        user: cs.get('SMTP_USERNAME'),
                        pass: cs.get('SMTP_PASSWORD')
                    }
                },
                template: {
                    dir: __dirname + '../../../templates',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }
            })
        })
    ],
    providers: [SMTPService],
    exports: [SMTPService]
})
export class SMTPModule {}
