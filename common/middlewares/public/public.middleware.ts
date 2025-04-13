import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RedisService } from "../../../common/services/redis.service";


@Injectable()
export class PublicMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PublicMiddleware.name);

  constructor(
    private readonly redisService: RedisService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const access_token = req.headers['authorization']?.split('Bearer ')[1];

      if (access_token) {
        const payload = await this.redisService.get(access_token);
        if (payload) req['_user'] = JSON.parse(payload);
      }
      next();
    } catch (error) {
      this.logger.log(error);
    }
  }
}