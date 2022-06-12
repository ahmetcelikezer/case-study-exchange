import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserSeeder } from './UserSeeder';
import { StockSeeder } from './StockSeeder';
import { TransactionSeeder } from './TransactionSeeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [UserSeeder, StockSeeder, TransactionSeeder]);
  }
}
