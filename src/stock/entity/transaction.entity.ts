import {
  DateTimeType,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../user/entity/user.entity';
import { Stock } from './stock.entity';

@Entity()
export class Transaction {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @ManyToOne({ nullable: false })
  stock!: Stock;

  @Property()
  amount!: number;

  @Property({ columnType: 'decimal(15,2)' })
  rate!: string;

  @ManyToOne()
  from: User;

  @ManyToOne({ nullable: true })
  to: User | null;

  @Property({ type: DateTimeType })
  createdAt: Date;

  @Property({ type: DateTimeType, nullable: true })
  completedAt?: Date;

  getRateAsNumber(): number {
    return parseFloat(this.rate);
  }
}
