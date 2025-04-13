import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ErrorDto } from '../dtos/response/error.dto';
import { FieldErrorDto } from '../dtos/response/field-error.dto';
import { ResponseDto } from '../dtos/response/response.dto';
import { SystemErrorDto } from '../dtos/response/system-error.dto';

export class SystemException extends HttpException {
  constructor(error: any) {
    let status = error.status;
    let message = error.message;
    console.log(error);
    // Check if the error is a validation error
    if (error?.errors) {
      status = HttpStatus.BAD_REQUEST;
      message = 'DTO validation failed';

      const fieldErrors: FieldErrorDto[] = [];
      for (const key in error.errors) {
        fieldErrors.push(
          new FieldErrorDto(error.errors[key].property, error.errors[key].constraints, null)
        );
      }

      const errorDto = new ErrorDto(fieldErrors, null);
      super(new ResponseDto(Date.now(), status, message, errorDto, null), status);
      return;
    }
    const systemErrorDto = new SystemErrorDto('System Error', 'ERROR', message);
    const errorDto = new ErrorDto(null, systemErrorDto);
    super(new ResponseDto(Date.now(), status, message, errorDto, null), status);
  }
}