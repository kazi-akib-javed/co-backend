import { Injectable, NestMiddleware } from "@nestjs/common";
import * as cookie from 'cookie'; // Import cookie parser

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Parse cookies from the 'cookie' header
    const cookies = cookie.parse(req.headers.cookie || ''); // Empty string as fallback in case no cookies exist
    const csrfTokenFromCookie = cookies?.csrftoken; // Access the csrf token from the cookies

    // Get csrf token from the header
    const csrfTokenFromHeader = req.headers.cookie?.split('csrftoken=')[1]?.split(';')[0]; // Extract the csrf token from the header

    // Compare both tokens and respond accordingly
    if (!csrfTokenFromCookie || csrfTokenFromCookie !== csrfTokenFromHeader) {
      console.error("CSRF token mismatch");
      return res.status(403).send({ message: "Invalid CSRF token" });
    }
    
    next();
  }
}
