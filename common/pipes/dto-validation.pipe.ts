import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
  } from '@nestjs/common';
  import { plainToInstance } from 'class-transformer';
  import { validate } from 'class-validator';
  
  @Injectable()
  export class DtoValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
      const { metatype } = metadata;
      if (!metatype || !this.toValidate(metatype)) {
        return value;
      }
      const object = plainToInstance(metatype, value);
      const errors = await validate(object, {
        whitelist: true, // Remove properties not defined in DTO
        forbidNonWhitelisted: true, // Throw error for undefined properties
        skipMissingProperties: false, // Ensure all required properties are present
      });
  
      if (errors.length > 0) {
        // Transform errors into a human-readable format
        const messages = errors.map(
          (err) =>
            `${err.property}: ${Object.values(err.constraints).join(', ')}`,
        );
        throw new BadRequestException(messages);
      }
  
      return value;
    }
  
    private toValidate(metatype: Function): boolean {
      const types: Function[] = [String, Boolean, Number, Array, Object];
      return !types.includes(metatype);
    }

  }