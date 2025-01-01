import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const csrfToken = req.headers['x-csrf-token'];// Token sent in the header
    const csrfCookie = req.cookies['csrf-token']; // Token stored in the HttpOnly cookie
    // Validate CSRF token
    if (!csrfToken || csrfToken !== csrfCookie) {
      throw new HttpException('Invalid CSRF token', HttpStatus.FORBIDDEN);
    }
    next();
  }
}
