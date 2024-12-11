import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    HttpStatus,
} from '@nestjs/common';
import { ResponseDto, PayloadDto } from 'common/dtos/dto.config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PayloadInterceptor<T> implements NestInterceptor<T, ResponseDto> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto> {
        return next.handle().pipe(
            map((data: T) => {
                let count: number;
                if(data instanceof Array){
                    count = data instanceof Array ? data.length:0;
                }else{
                    count = data ? 1 : 0;
                }
                const payload = new PayloadDto(count, data);
                return new ResponseDto(
                    new Date().getTime(),
                    HttpStatus.OK,
                    'Successful!',
                    null,
                    payload,
                );
            }),
        );
    }
}
