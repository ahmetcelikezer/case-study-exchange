import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginRequestDTO } from '../dto/login-request.dto';
import { User } from '../../user/entity/user.entity';
import { BadRequestException } from '@nestjs/common';
import { RegisterRequestDTO } from '../dto/register-request.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useFactory: jest.fn(() => ({
            validateUser: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
          })),
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return response when success', async () => {
      const request: LoginRequestDTO = {
        email: 'john@doe.com',
        password: 'plain_password',
      };
      const user = new User();

      jest
        .spyOn(authService, 'validateUser')
        .mockReturnValue(Promise.resolve(user));
      jest
        .spyOn(authService, 'login')
        .mockReturnValue(Promise.resolve('token'));

      const response = await authController.login(request);

      expect(response).toMatchObject({
        token: 'token',
        user,
      });
    });

    it('should return error when user is not found', async () => {
      const request: LoginRequestDTO = {
        email: 'john@doe.com',
        password: 'plain_password',
      };

      jest
        .spyOn(authService, 'validateUser')
        .mockReturnValue(Promise.resolve(undefined));

      await expect(authController.login(request)).rejects.toThrowError(
        new BadRequestException('Invalid credentials'),
      );
    });
  });

  describe('register', () => {
    it('should return response when success', async () => {
      const request: RegisterRequestDTO = {
        email: 'john@doe.com',
        password: 'plain_password',
      };
      const user = new User();

      jest
        .spyOn(authService, 'register')
        .mockReturnValue(Promise.resolve(user));
      jest
        .spyOn(authService, 'login')
        .mockReturnValue(Promise.resolve('token'));

      const response = await authController.register(request);

      expect(response).toMatchObject({
        token: 'token',
        user,
      });
    });

    it('should return error when user is already exists', async () => {
      const request: RegisterRequestDTO = {
        email: 'john@doe.com',
        password: 'plain_password',
      };

      jest
        .spyOn(authService, 'register')
        .mockReturnValue(Promise.resolve(undefined));

      await expect(authController.register(request)).rejects.toThrowError(
        new BadRequestException('User already exists'),
      );
    });
  });
});
