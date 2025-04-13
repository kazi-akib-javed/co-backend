import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as crypto from 'crypto';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    if (!response.locals.csrfTokenSet) {
      // Ensure the cookie is set only once
      response.locals.csrfTokenSet = true;
      const csrfToken = crypto.randomBytes(32).toString('hex');

      response.cookie('csrftoken', csrfToken, {
        httpOnly: false,
        secure: true, // Use true for HTTPS
        sameSite: 'Strict',
      });
    }
    return next.handle();
  }
}
