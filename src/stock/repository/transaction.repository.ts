import { EntityRepository } from '@mikro-orm/postgresql';
import { Transaction } from '../entity/transaction.entity';
import { User } from '../../user/entity/user.entity';
import { Stock } from '../entity/stock.entity';
import { LockMode, QueryOrder } from '@mikro-orm/core';

export class TransactionRepository extends EntityRepository<Transaction> {
  async findStockBelongingCount(user: User, stock: Stock): Promise<number> {
    const boughtCount = await this.count({
      to: user,
      stock,
      completedAt: { $ne: null },
    });

    const soldCount = await this.count({
      from: user,
      stock,
    });

    if (boughtCount === 0 || soldCount >= boughtCount) {
      return 0;
    }

    return boughtCount - soldCount;
  }

  async findAvailableStocksCountOnSale(stock: Stock): Promise<number> {
    return this.count({
      stock,
      to: null,
      completedAt: null,
    });
  }

  async findAvailableStocksOnSale(
    stock: Stock,
    limit: number,
  ): Promise<Transaction[]> {
    return this.find(
      {
        stock,
        to: null,
        completedAt: null,
      },
      { orderBy: { rate: QueryOrder.ASC }, limit },
    );
  }
}
