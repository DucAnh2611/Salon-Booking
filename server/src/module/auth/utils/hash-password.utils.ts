import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordUtil {
  constructor() {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comparePassword(password: string, storePasswordHash: string): Promise<any> {
    return await bcrypt.compare(password, storePasswordHash);
  }
}
