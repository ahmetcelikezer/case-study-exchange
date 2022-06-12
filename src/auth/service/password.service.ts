import { hash, compare, hashSync } from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  private readonly SALT_ROUNDS: number = 12;

  public async hashPassword(password: string): Promise<string> {
    return hash(password, this.SALT_ROUNDS);
  }

  public async comparePassword(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }

  public hashPasswordSync(password: string): string {
    return hashSync(password, this.SALT_ROUNDS);
  }
}
