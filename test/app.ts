import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

export let app: INestApplication;

export const getRepository = <T>(entity: T): EntityRepository<T> => {
  const orm = app.get(MikroORM);

  return orm.em.fork().getRepository(entity);
};

export const resetDatabase = async () => {
  if (!app) throw new Error('App is not initialized');

  const orm = app.get(MikroORM);

  const generator = orm.getSchemaGenerator();
  await generator.refreshDatabase();
};

const init = async () => {
  if (app) return;

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
};

beforeAll(async () => {
  await init();
  await resetDatabase();
});

afterAll(async () => {
  await app.close();
});
