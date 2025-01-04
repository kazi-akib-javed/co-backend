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
import { CsrfService } from 'common/services/csrf.service';
  
  @Injectable()
  export class CsrfTokenInterceptor implements NestInterceptor {
    constructor(@Inject(ConfigService)private readonly csrfService: CsrfService){}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();
      // Generate a CSRF token
      const csrfToken = crypto.randomBytes(32).toString('hex');
      return next.handle().pipe(
        tap(() => {
          // Set the CSRF token in a cookie
          response.cookie('csrf-token', csrfToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
          });
        }),
      );
    }
  }
  