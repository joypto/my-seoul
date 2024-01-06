import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Page } from 'src/api/common/page/page.dto';

type Response<T> = {
    data: T;
};

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data) => ({
                code: context.switchToHttp().getResponse().statusCode,
                meta: data instanceof Page ? data.meta : undefined,
                data: data instanceof Page ? [...data.data] : [data]
            }))
        );
    }
}
