import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  PrimaryKey,
  Property,
  StringType,
  Unique,
} from '@mikro-orm/core';
import { StockPrice } from './stock-price.entity';
import { Transaction } from './transaction.entity';
import { StockRepository } from '../repository/stock.repository';

@Entity({ customRepository: () => StockRepository })
export class Stock {
  [EntityRepositoryType]?: StockRepository;

  @Unique()
  @PrimaryKey({ type: StringType, length: 3 })
  symbol!: string;

  @Property()
  name!: string;

  @OneToMany({
    entity: () => StockPrice,
    mappedBy: 'stock',
    orphanRemoval: true,
  })
  prices = new Collection<StockPrice>(this);

  @OneToMany({
    entity: () => Transaction,
    mappedBy: 'stock',
  })
  transactions = new Collection<Transaction>(this);
}
