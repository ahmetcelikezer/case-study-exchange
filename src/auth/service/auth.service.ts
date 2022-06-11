import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { RegisterRequestDTO } from '../dto/register-request.dto';
import { User } from '../../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async register(dto: RegisterRequestDTO): Promise<User | undefined> {
    const userExists = await this.userService.isUserEmailExists(dto.email);
    if (userExists) {
      return undefined;
    }

    const password = await this.passwordService.hashPassword(dto.password);

    return AuthService.clearCredentials(
      await this.userService.createUser({
        email: dto.email,
        password,
      }),
    );
  }

  async login(user: User): Promise<string> {
    return this.jwtService.sign({ id: user.id });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return undefined;
    }

    const isValid = await this.passwordService.comparePassword(
      password,
      user.password,
    );
    if (!isValid) {
      return undefined;
    }
    delete user.password;

    return AuthService.clearCredentials(user);
  }

  private static clearCredentials(user: User): User {
    delete user.password;

    return user;
  }
}
