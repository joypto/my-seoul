import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggerMiddleware.name);

    private masking(body: { [field: string]: string }, fields: string[]) {
        fields.forEach((field) => {
            if (body.hasOwnProperty(field)) body[field] = '******';
        });
    }

    use(req: Request, res: Response, next: NextFunction) {
        const startTime: number = Date.now();
        const { method, originalUrl, ip, body } = req;
        const bodyCopy = Object.assign({}, body);
        this.masking(bodyCopy, [
            'authCode',
            'password',
            'oldPassword',
            'newPassword',
            'refreshToken'
        ]);

        const requestLog = `${method} ${originalUrl} ${ip}, body:${JSON.stringify(bodyCopy)}`;
        this.logger.log(requestLog);

        next();

        res.on('finish', () => {
            const endTime: number = Date.now();
            const { statusCode, statusMessage } = res;
            const responseLog = `${method} ${originalUrl} ${ip}, status:{"code":${statusCode},"message":${statusMessage}}, ${
                endTime - startTime
            }ms`;

            if (statusCode < 400) {
                this.logger.log(responseLog);
            } else if (statusCode < 500) {
                this.logger.warn(responseLog);
            } else {
                this.logger.error(responseLog);
            }
        });
    }
}
