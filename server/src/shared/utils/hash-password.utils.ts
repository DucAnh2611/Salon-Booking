import * as bcrypt from 'bcrypt';

export class HashPasswordUtil {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, storePasswordHash: string): Promise<any> {
    return await bcrypt.compare(password, storePasswordHash);
  }
}
