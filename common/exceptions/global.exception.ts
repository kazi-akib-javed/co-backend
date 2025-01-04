import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // Log the error for debugging
    this.logger.error(
      `${request.method} ${request.url} - ${exception.status} - ${exception?.response?.error} - Message:  ${exception?.message}`,
      exception.stack,
    );
    // Response structure for the client
    response.status(status).json(exception.response);
  }
}
