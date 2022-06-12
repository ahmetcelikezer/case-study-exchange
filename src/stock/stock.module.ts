import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Stock } from './entity/stock.entity';
import { StockPrice } from './entity/stock-price.entity';
import { Transaction } from './entity/transaction.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Stock, StockPrice, Transaction] }),
  ],
})
export class StockModule {}
