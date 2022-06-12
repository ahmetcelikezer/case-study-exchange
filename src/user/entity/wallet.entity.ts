import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { WalletRepository } from '../repository/wallet.repository';

@Entity({ customRepository: () => WalletRepository })
export class Wallet {
  [EntityRepositoryType]?: WalletRepository;

  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property({ columnType: 'decimal(15,2)', default: 0 })
  balance!: string;

  constructor() {
    this.id = v4();
  }

  getBalanceAsNumber(): number {
    return parseFloat(this.balance);
  }

  addMoney(amount: number): void {
    this.balance = (this.getBalanceAsNumber() + amount).toFixed(2);
  }

  drawMoney(amount: number): void {
    if (this.getBalanceAsNumber() < amount) {
      throw new Error('You cant draw money more than user have');
    }
    this.balance = (this.getBalanceAsNumber() - amount).toFixed(2);
  }
}
