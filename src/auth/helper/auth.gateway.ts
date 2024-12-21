import { ResponseDto, SystemException, UserResponseDto } from "common";
import { AuthDto } from "../dto/auth.dto";
import { AuthHelperService } from "./auth-helper.service";
import { RegisterDto } from "../dto/register.dto";

export abstract class AuthGateway {
    abstract registerWith(registerDto: RegisterDto):any;
    abstract loginWith(authDto: AuthDto):any;
}

export class GeneralAuthGateway implements AuthGateway{
    constructor(private readonly authHelperService: AuthHelperService){}
    loginWith = async (authDto: AuthDto): Promise<UserResponseDto> => {
        try {
            return await this.authHelperService.loginHeplper(authDto);
        } catch (error) {
            throw new SystemException(error);
        }
    }
    registerWith = async (authDto: RegisterDto): Promise<RegisterDto> => {
        try {
            return await this.authHelperService.registerHelper(authDto);
        } catch (error) {
            throw new SystemException(error);
        }
    }
}

export enum AUTH_METHOD{
    GENERAL = 'general'
}