import { Stock } from '../../entity/stock.entity';
import { Factory, Faker } from '@mikro-orm/seeder';

export class StockFactory extends Factory<Stock> {
  model = Stock;

  protected definition(faker: Faker): Partial<Stock> {
    return {
      name: faker.finance.currencyName(),
      symbol: faker.random.alpha(3).toUpperCase(),
    };
  }
}
