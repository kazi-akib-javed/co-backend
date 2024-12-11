import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SystemException } from "common/exceptions/system.exception"
import { BcryptService } from "./bcrypt.service";

export class OtpService {
    constructor(
        @Inject(ConfigService)
        private readonly configService: ConfigService,
        @Inject(BcryptService)
        private readonly bcryptService: BcryptService
    ) {

    }
    randomCharacterGenerate = async(length: number): Promise<string> => {
        try {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const  charactersLength = characters.length;
            let result = '';
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            return result;
        } catch (error) {
            throw new SystemException(error);
        }
    }

    randomPasswordGenerator = async (length=this.configService.get<number>("RANDOMPASSWORD_LENGTH")): Promise<string> => {
        try {
            const randomPassword = await this.randomCharacterGenerate(length);
            return await this.bcryptService.hashPassword(randomPassword);
        } catch (error) {
            throw new SystemException(error);
        }
    }
}