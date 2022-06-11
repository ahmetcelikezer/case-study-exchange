import { RegisterRequestDTO } from '../dto/register-request.dto';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { User } from '../../user/entity/user.entity';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        PasswordService,
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useFactory: jest.fn(),
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    passwordService = moduleRef.get<PasswordService>(PasswordService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should return user when user is registered', async () => {
      const hashedPassword = 'hashed_password';

      const user = createUser();

      const dto: RegisterRequestDTO = {
        email: user.email,
        password: 'plain_password',
      };

      jest
        .spyOn(userService, 'isUserEmailExists')
        .mockReturnValue(Promise.resolve(false));
      jest
        .spyOn(passwordService, 'hashPassword')
        .mockReturnValue(Promise.resolve(hashedPassword));
      jest
        .spyOn(userService, 'createUser')
        .mockReturnValue(Promise.resolve(user));

      const result = await authService.register(dto);

      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email);
      expect(result.password).toBeUndefined();
    });

    it('should return undefined when user is already exists', async () => {
      const dto: RegisterRequestDTO = {
        email: 'john@doe.com',
        password: 'secret',
      };

      jest
        .spyOn(userService, 'isUserEmailExists')
        .mockReturnValue(Promise.resolve(true));

      const result = await authService.register(dto);

      expect(result).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should return token when user is logged in', async () => {
      const user = createUser();

      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await authService.login(user);

      expect(result).toBe('token');
    });
  });

  describe('validateUser', () => {
    let user: User;
    let email: string;
    const password = 'plain_password';

    beforeAll(() => {
      user = createUser();
      email = user.email;
    });

    it('should return user when credentials matches user', async () => {
      jest
        .spyOn(userService, 'findByEmail')
        .mockReturnValue(Promise.resolve(user));
      jest
        .spyOn(passwordService, 'comparePassword')
        .mockReturnValue(Promise.resolve(true));

      const result = await authService.validateUser(email, password);

      expect(result).toBeDefined();
      expect(result.email).toBe(email);
      expect(result.password).toBeUndefined();
    });

    it('should return undefined when user not exists with given credentials', async () => {
      jest
        .spyOn(userService, 'findByEmail')
        .mockReturnValue(Promise.resolve(null));

      const result = await authService.validateUser(email, password);

      expect(result).toBeUndefined();
    });

    it('should return undefined when user exists but password is wrong', async () => {
      jest
        .spyOn(userService, 'findByEmail')
        .mockReturnValue(Promise.resolve(user));
      jest
        .spyOn(passwordService, 'comparePassword')
        .mockReturnValue(Promise.resolve(false));

      const result = await authService.validateUser(email, password);

      expect(result).toBeUndefined();
    });
  });
});

const createUser = (): User => {
  const user = new User();
  user.email = 'john@doe.com';
  user.password = 'secret';

  return user;
};
