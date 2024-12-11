import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
  
  @Injectable()
  export class CsrfTokenInterceptor implements NestInterceptor {
    constructor(@Inject(ConfigService)private readonly configService: ConfigService){}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();

      return next.handle().pipe(
        tap(() => {
          // Generate a CSRF token
          const csrfToken = crypto.randomBytes(32).toString('hex');
          // Set the CSRF token in a cookie
          response.cookie('csrf-token', csrfToken, {
            httpOnly: true,
            secure: this.configService.get<string>("NODE_ENV") === 'prod',
            sameSite: 'Strict',
          });
        }),
      );
    }
  }
  