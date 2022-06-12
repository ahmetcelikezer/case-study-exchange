import { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../user/entity/user.entity';
import { Stock } from '../stock/entity/stock.entity';
import { TransactionFactory } from '../stock/factory/entity/transaction.factory';

export class TransactionSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const users: User[] = context.users;
    const stocks: Stock[] = context.stocks;

    // create sellers
    users.forEach(user => {
      new TransactionFactory(em)
        .each(transaction => {
          const stock = stocks.shift();
          stocks.push(stock);

          transaction.stock = stock;
          transaction.from = user;
        })
        .create(15);
    });

    // create completed transaction
    users.forEach(user => {
      new TransactionFactory(em)
        .each(transaction => {
          const stock = stocks.shift();
          stocks.push(stock);
          const buyerUser = users.shift();
          users.push(buyerUser);

          transaction.stock = stock;
          transaction.from = user;
          transaction.to = buyerUser;
          transaction.completedAt = new Date();
        })
        .create(15);
    });
  }
}
