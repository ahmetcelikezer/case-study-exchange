import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Stock } from './entity/stock.entity';
import { StockPrice } from './entity/stock-price.entity';
import { Transaction } from './entity/transaction.entity';
import { StockController } from './controller/stock.controller';
import { TransactionService } from './service/transaction.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Stock, StockPrice, Transaction] }),
  ],
  providers: [TransactionService],
  controllers: [StockController],
})
export class StockModule {}
