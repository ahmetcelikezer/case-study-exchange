import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  StringType,
  Unique,
} from '@mikro-orm/core';
import { StockPrice } from './stock-price.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Stock {
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
  price = new Collection<StockPrice>(this);

  @OneToMany({
    entity: () => Transaction,
    mappedBy: 'stock',
  })
  transactions = new Collection<Transaction>(this);
}
