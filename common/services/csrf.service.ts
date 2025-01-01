import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';
@Injectable()
export class CsrfService{
    constructor(){}
    generateCsrf = ()=>{
        return crypto.randomBytes(32).toString('hex')
    }
}