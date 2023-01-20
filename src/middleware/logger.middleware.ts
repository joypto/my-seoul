import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggerMiddleware.name);

    public use(req: Request, res: Response, next: NextFunction) {
        const startTime: number = Date.now();
        const url = req.originalUrl || req.url || req.baseUrl || '-';
        const reqLog = JSON.stringify({
            method: req.method,
            url: req.originalUrl || req.url || req.baseUrl || '-',
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        this.logger.log(reqLog);

        next();

        res.on('finish', () => {
            const endTime: number = Date.now();
            const resLog = JSON.stringify({
                url: req.originalUrl || req.url || req.baseUrl || '-',
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
                handleTime: `${endTime - startTime} ms`
            });

            if (res.statusCode < 300) {
                this.logger.log(resLog);
            } else if (res.statusCode < 400) {
                this.logger.warn(resLog);
            } else {
                this.logger.error(resLog);
            }
        });
    }
}
