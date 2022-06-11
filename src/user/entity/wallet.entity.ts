import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Wallet {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property({ columnType: 'decimal(15,2)', default: 0 })
  balance!: number;

  constructor() {
    this.id = v4();
  }
}
