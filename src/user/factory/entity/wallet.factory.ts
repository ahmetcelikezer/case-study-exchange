import { Factory, Faker } from '@mikro-orm/seeder';
import { Wallet } from '../../entity/wallet.entity';

export class WalletFactory extends Factory<Wallet> {
  model = Wallet;

  protected definition(faker: Faker): Partial<Wallet> {
    return {
      id: faker.datatype.uuid(),
      balance: faker.finance.amount(0.01, 400.99, 2),
    };
  }
}
