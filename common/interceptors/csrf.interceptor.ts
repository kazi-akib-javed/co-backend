import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';

import { ConfigService } from '@nestjs/config';
import { CsrfService } from 'common/services/csrf.service';
  
  @Injectable()
  export class CsrfTokenInterceptor implements NestInterceptor {
    constructor(@Inject(ConfigService)private readonly csrfService: CsrfService){}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();

      return next.handle().pipe(
        tap(() => {
          // Generate a CSRF token
          const csrfToken = this.csrfService.generateCsrf();
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
  