import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';

export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['api-key'];
    if (process.env.API_KEY === apiKey) next();
    else throw new UnauthorizedException('Invalid api key');
  }
}
