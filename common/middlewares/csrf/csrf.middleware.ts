import { Injectable, NestMiddleware } from "@nestjs/common";
import * as cookie from 'cookie'; // Import cookie parser

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Parse cookies from the 'cookie' header
    const cookies = cookie.parse(req.headers.cookie || ''); // Empty string as fallback in case no cookies exist
    const csrfTokenFromCookie = cookies?.csrftoken; // Access the csrf token from the cookies

    // Get csrf token from the header
    const csrfTokenFromHeader = req.headers["x-csrf-token"];

    // Compare both tokens and respond accordingly
    if (!csrfTokenFromCookie || csrfTokenFromCookie !== csrfTokenFromHeader) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }
    
    next();
  }
}
