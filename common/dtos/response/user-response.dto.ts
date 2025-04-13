import { BaseDto } from "../dto.config";

export class UserResponseDto extends BaseDto {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    roles: '';
    email: string;
    refreshToken: string;
    accessToken: string;
    role: string;
    csrf: string;
  }