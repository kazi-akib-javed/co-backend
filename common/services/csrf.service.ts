import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';
@Injectable()
export class CsrfService{
    constructor(){}
    generateCsrf ():string {
        const token = crypto.randomBytes(32).toString('hex');
        console.log(token);
        return token;
    }
}