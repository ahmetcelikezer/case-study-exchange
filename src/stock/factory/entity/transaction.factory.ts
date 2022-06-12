import { Factory, Faker } from '@mikro-orm/seeder';
import { Transaction } from '../../entity/transaction.entity';

export class TransactionFactory extends Factory<Transaction> {
  model = Transaction;

  protected definition(faker: Faker): Partial<Transaction> {
    return {
      id: faker.datatype.uuid(),
      rate: faker.finance.amount(0.01, 400.99, 2),
      createdAt: faker.date.past(),
    };
  }
}
