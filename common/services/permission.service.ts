import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserResponseDto } from '../dtos/response/user-response.dto';

@Injectable()
export class PermissionService {
	constructor(@Inject(REQUEST) private readonly request: Request) {}

	returnRequest = (): UserResponseDto => {
		return this.request["_user"];
	};
}