import { Factory, Faker } from '@mikro-orm/seeder';
import { StockPrice } from '../../entity/stock-price.entity';

export class StockPriceFactory extends Factory<StockPrice> {
  model = StockPrice;

  protected definition(faker: Faker): Partial<StockPrice> {
    return {
      id: faker.datatype.uuid(),
      rate: faker.finance.amount(0.01, 400.99, 2),
      issuedAt: faker.date.past(),
    };
  }
}
