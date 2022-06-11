import * as request from 'supertest';
import { app, getRepository } from '../app';
import { CreateUserDTO } from '../../src/user/dto/create-user.dto';
import { createUserHelper } from '../helper/user.helper';
import { User } from '../../src/user/entity/user.entity';
import { faker } from '@faker-js/faker';

const REGISTER_ENDPOINT = '/auth/register';
const LOGIN_ENDPOINT = '/auth/login';

describe('AuthController', () => {
  describe('login', () => {
    const incorrectFields = [
      ['', faker.internet.password()],
      [faker.internet.email(), ''],
      [faker.word.verb(5), faker.internet.password()],
    ];

    it('should return token and user on successful login', async () => {
      const existingUserCredentials: CreateUserDTO = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const existingUser = await createUser(existingUserCredentials);

      return request(app.getHttpServer())
        .post(LOGIN_ENDPOINT)
        .send(existingUserCredentials)
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toMatchObject({
            token: expect.any(String),
            user: {
              id: existingUser.id,
              email: existingUser.email,
              wallet: existingUser.wallet,
            },
          });
        });
    });

    it('should return error when not existing user email', async () => {
      return request(app.getHttpServer())
        .post(LOGIN_ENDPOINT)
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Invalid credentials',
          error: 'Unauthorized',
        });
    });

    it('should return error when password is not correct', async () => {
      const existingUserCredentials: CreateUserDTO = {
        email: faker.internet.email(faker.internet.userName()),
        password: faker.internet.password(),
      };
      const existingUser = await createUser(existingUserCredentials);

      return request(app.getHttpServer())
        .post(LOGIN_ENDPOINT)
        .send({
          email: existingUser.email,
          password: faker.internet.password(),
        })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Invalid credentials',
          error: 'Unauthorized',
        });
    });

    it.each(incorrectFields)(
      'should return error when incorrect inputs are provided',
      async (email, password) => {
        return request(app.getHttpServer())
          .post(LOGIN_ENDPOINT)
          .send({ email, password })
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'Validation failed',
            error: 'Bad Request',
          });
      },
    );
  });

  describe('register', () => {
    const incorrectFields = [
      ['', faker.internet.password()],
      [faker.internet.email(), ''],
      [faker.word.verb(5), faker.internet.password()],
    ];

    it('should return token and user on successful registration', async () => {
      const newUserCredentials: CreateUserDTO = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      return request(app.getHttpServer())
        .post(REGISTER_ENDPOINT)
        .send(newUserCredentials)
        .then(response => {
          expect(response.statusCode).toBe(201);
          expect(response.body).toMatchObject({
            token: expect.any(String),
            user: {
              id: expect.any(String),
              email: newUserCredentials.email,
              wallet: {
                id: expect.any(String),
                balance: '0.00',
              },
            },
          });
        });
    });

    it('should return error when user email already exists', async () => {
      const newUserCredentials: CreateUserDTO = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      await createUser(newUserCredentials);

      return request(app.getHttpServer())
        .post(REGISTER_ENDPOINT)
        .send(newUserCredentials)
        .expect(409)
        .expect({
          statusCode: 409,
          message: 'User already exists',
          error: 'Conflict',
        });
    });

    it.each(incorrectFields)(
      'should return error when incorrect inputs are provided',
      async (email, password) => {
        return request(app.getHttpServer())
          .post(REGISTER_ENDPOINT)
          .send({ email, password })
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'Validation failed',
            error: 'Bad Request',
          });
      },
    );
  });
});

const createUser = async (dto: CreateUserDTO): Promise<User> => {
  const repository = getRepository(User);
  return createUserHelper(repository, dto);
};
