export class FieldErrorDto {
    constructor(
      public field: string,
      public message: string | string[],
      public value?: string,
      public children?: FieldErrorDto[],
    ) {}
  }