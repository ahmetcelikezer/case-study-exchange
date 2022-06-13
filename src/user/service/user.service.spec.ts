import { UserRepository } from '../repository/user.repository';
import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { User } from '../entity/user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';
import { faker } from '@faker-js/faker';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: jest.fn(() => ({
            findOne: jest.fn(),
            persistAndFlush: jest.fn(),
            count: jest.fn(),
          })),
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('findById', () => {
    it('should return user when user exists', async () => {
      const user = new User();

      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(user));

      const result = await userService.findById(user.id);

      expect(result).toBe(user);
    });

    it('should return null when user not found', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(null));

      const result = await userService.findById(faker.datatype.uuid());

      expect(result).toBeNull();
    });
  });
  describe('findByEmail', () => {
    it('should return user when user exists', async () => {
      const email = 'john@doe.com';
      const user = new User();
      user.email = email;

      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(user));

      const result = await userService.findByEmail(email);

      expect(result).toBe(user);
    });

    it('should return null when user not found', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(null));

      const result = await userService.findByEmail('john@doe.com');

      expect(result).toBeNull();
    });
  });
  describe('createUser', () => {
    it('should return user after create', async () => {
      const dto: CreateUserDTO = {
        email: 'john@doe.com',
        password: 'secret',
      };
      const user = new User();
      user.email = dto.email;
      user.password = dto.password;

      jest
        .spyOn(userRepository, 'persistAndFlush')
        .mockReturnValue(Promise.resolve());

      const result = await userService.createUser(dto);

      expect(result.id).toBeDefined();
      expect(result.email).toBe(user.email);
      expect(result.password).toBe(user.password);
    });
  });
  describe('isUserEmailExists', () => {
    it('should return true when user exists', async () => {
      jest.spyOn(userRepository, 'count').mockReturnValue(Promise.resolve(1));

      const result = await userService.isUserEmailExists('john@doe.com');

      expect(result).toBe(true);
    });

    it('should return false when user not exists', async () => {
      jest.spyOn(userRepository, 'count').mockReturnValue(Promise.resolve(0));

      const result = await userService.isUserEmailExists('john@doe.com');

      expect(result).toBe(false);
    });
  });
});
