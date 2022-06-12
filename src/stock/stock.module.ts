import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Stock } from './entity/stock.entity';
import { StockPrice } from './entity/stock-price.entity';
import { Transaction } from './entity/transaction.entity';
import { StockController } from './controller/stock.controller';
import { WalletService } from '../user/service/wallet.service';
import { TransactionService } from './service/transaction.service';
import { Wallet } from '../user/entity/wallet.entity';
import { User } from '../user/entity/user.entity';
import { StockService } from './service/stock.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Stock, StockPrice, Transaction, Wallet, User],
    }),
  ],
  providers: [WalletService, TransactionService, StockService],
  controllers: [StockController],
})
export class StockModule {}
