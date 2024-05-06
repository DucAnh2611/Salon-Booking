import { Request } from 'express';

export class ExtractStrategy {
  static extractFromCookies(name: string): (req: Request) => string | null {
    return (req: Request) => {
      return req.cookies[name] || null;
    };
  }
}
