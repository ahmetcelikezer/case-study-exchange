import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StockRepository } from '../repository/stock.repository';
import { TransactionRepository } from '../repository/transaction.repository';
import { Stock } from '../entity/stock.entity';
import { StockPrice } from '../entity/stock-price.entity';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    private readonly stockRepository: StockRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleUpdateStockPriceCron() {
    this.logger.log('Updating stock prices...');

    const stocks = await this.stockRepository.findAll();
    if (!stocks) {
      this.logger.log('No stocks found!');
      return;
    }

    await stocks.forEach(stock => this.updateStockPrice(stock));

    this.logger.log('Stock prices updated!');
  }

  private async updateStockPrice(stock: Stock): Promise<void> {
    this.logger.log(`Updating stock price for ${stock.symbol}...`);
    const lastTransaction = await this.transactionRepository.findLastTransactionByStock(
      stock,
    );
    if (!lastTransaction) {
      this.logger.log(
        `Skipping stock ${stock.symbol} because it has no transactions`,
      );
      return;
    }

    const newPrice = lastTransaction.rate;

    const newStockPrice = new StockPrice();
    newStockPrice.stock = stock;
    newStockPrice.rate = newPrice;
    stock.prices.add(newStockPrice);

    await this.stockRepository.persistAndFlush(stock);
    this.logger.log(`Stock price for ${stock.symbol} updated to ${newPrice}`);
  }
}
