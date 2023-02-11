import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

type ExceptionResponse = {
    statusCode: number;
    error: string;
    message: string;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const exceptionResponse = exception.getResponse() as ExceptionResponse;
        const response = host.switchToHttp().getResponse<Response>();

        response.status(exceptionResponse.statusCode).json({
            statusCode: exceptionResponse.statusCode,
            data: {
                error: exceptionResponse.error,
                message: exceptionResponse.message
            },
            timestamp: new Date().toISOString()
        });
    }
}
