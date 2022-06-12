import {
  DateTimeType,
  DecimalType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  UuidType,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Stock } from './stock.entity';

@Entity()
export class StockPrice {
  @PrimaryKey({ type: UuidType })
  id: string;

  @ManyToOne()
  stock!: Stock;

  @Property({ columnType: 'decimal(15,2)' })
  rate!: string;

  @Property({ type: DateTimeType, onCreate: () => new Date() })
  issuedAt: Date;

  constructor() {
    this.id = v4();
    this.issuedAt = new Date();
  }

  getRateAsNumber(): number {
    return parseFloat(this.rate);
  }
}
