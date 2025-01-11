import {
  Injectable,
  NestMiddleware
} from "@nestjs/common";

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const csrfTokenFromCookie = req.headers.cookie.split("=")[1];
    const csrfTokenFromHeader = req.headers["x-csrf-token"];

    if (!csrfTokenFromCookie || csrfTokenFromCookie !== csrfTokenFromHeader) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }
    next();
  }
}
