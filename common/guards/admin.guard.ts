import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserResponseDto } from "common/dtos/dto.config";
import { SystemException } from "common/exceptions/system.exception";

@Injectable()
export class AdminGuard implements CanActivate{
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest<Request>();
        const user = req['_user'] as UserResponseDto;
        const error = {isGuard: true};
        if(!user){
            throw new SystemException(error);
        }
        if(user.role=='Admin'){
            return true;
        }
        throw new SystemException(error);
    }
}