import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

export interface IExceptionResponse {
    statusCode: number;
    message: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getResponse<Request>();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const message = exception.message;

        this.logger.error(JSON.stringify({ path: request.path, message }));

        const responseBody = exception.getResponse() as IExceptionResponse;
        response.status(status).json({
            statusCode: responseBody.statusCode,
            message: responseBody.message,
            timestamp: new Date().toISOString(),
            path: request.url
        });
    }
}
