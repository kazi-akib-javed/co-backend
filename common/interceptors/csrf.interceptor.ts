import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import * as crypto from 'crypto';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfTokenInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CsrfTokenInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    if (!response.locals.csrfTokenSet) {
      // Ensure the cookie is set only once
      response.locals.csrfTokenSet = true;
      const csrfToken = crypto.randomBytes(32).toString('hex');

      response.cookie('csrf-token', csrfToken, {
        httpOnly: false,
        secure: true, // Use true for HTTPS
        sameSite: 'Strict',
      });
    }

    return next.handle();
  }
}
