import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserResponseDto } from '../dtos/response/user-response.dto';

@Injectable()
export class PermissionService {
	constructor(@Inject(REQUEST) private readonly request: Request) {}

	returnRequest = (): UserResponseDto => {
		const user: UserResponseDto = this.request["_user"] as UserResponseDto;
		return user ? user : null;
	};
}