import {
  DateTimeType,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../user/entity/user.entity';
import { Stock } from './stock.entity';
import { TransactionRepository } from '../repository/transaction.repository';
import { v4 } from 'uuid';

@Entity({ customRepository: () => TransactionRepository })
export class Transaction {
  [EntityRepositoryType]?: TransactionRepository;

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

  @Property({ type: DateTimeType, onCreate: () => new Date() })
  createdAt: Date;

  @Property({ type: DateTimeType, nullable: true, onUpdate: () => new Date() })
  completedAt?: Date;

  constructor() {
    this.id = v4();
  }

  getRateAsNumber(): number {
    return parseFloat(this.rate);
  }
}
