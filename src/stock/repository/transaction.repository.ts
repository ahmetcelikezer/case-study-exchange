import { EntityRepository } from '@mikro-orm/postgresql';
import { Transaction } from '../entity/transaction.entity';
import { User } from '../../user/entity/user.entity';
import { Stock } from '../entity/stock.entity';

export class TransactionRepository extends EntityRepository<Transaction> {
  async findStockBelongingCount(user: User, stock: Stock): Promise<number> {
    const knex = this.em.getKnex();

    const boughtCount = await knex
      .sum('amount')
      .from('transaction')
      .where({
        to_id: user.id,
        stock_symbol: stock.symbol,
      })
      .then(result => parseInt(result.map(value => value.sum).pop() ?? 0));

    const soldCount = await knex
      .sum('amount')
      .from('transaction')
      .where({
        from_id: user.id,
        stock_symbol: stock.symbol,
      })
      .then(result => parseInt(result.map(value => value.sum).pop() ?? 0));

    if (boughtCount === 0 || soldCount >= boughtCount) {
      return 0;
    }

    return boughtCount - soldCount;
  }
}
