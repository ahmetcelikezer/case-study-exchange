import { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { StockFactory } from '../stock/factory/entity/stock.factory';
import { StockPriceFactory } from '../stock/factory/entity/stock-price.factory';

export class StockSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    context.stocks = await new StockFactory(em)
      .each(stock => {
        const priceLogCount = Math.floor(Math.random() * 11);
        new StockPriceFactory(em).create(priceLogCount, { stock });
      })
      .create(5);
  }
}
