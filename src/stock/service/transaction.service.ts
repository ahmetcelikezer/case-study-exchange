import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repository/transaction.repository';
import { CreateSellTransactionDTO } from '../dto/create-sell-transaction.dto';
import { Transaction } from '../entity/transaction.entity';
import { User } from '../../user/entity/user.entity';
import { StockRepository } from '../repository/stock.repository';
import { Stock } from '../entity/stock.entity';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly stockRepository: StockRepository,
  ) {}

  async createSellTransaction(
    dto: CreateSellTransactionDTO,
    user: User,
  ): Promise<Transaction> {
    const stock = await this.stockRepository.findOne({  symbol: dto.stock });
    if (!stock) {
      throw new BadRequestException(
        `Provided stock ${dto.stock} is not valid!`,
      );
    }

    const canUserSend = await this.canSell(user, stock, dto.amount);
    if (!canUserSend) {
      throw new BadRequestException(
        `You do not have enough stocks to sell!`,
      );
    }

    const transaction = new Transaction();

    transaction.stock = stock;
    transaction.from = user;
    transaction.rate = dto.rate.toString();
    transaction.amount = dto.amount;

    await this.transactionRepository.persistAndFlush(transaction);

    return transaction;
  }

  private async canSell(
    user: User,
    stock: Stock,
    amount: number,
  ): Promise<boolean> {
    const userBelongingCount = await this.transactionRepository.findStockBelongingCount(
      user,
      stock,
    );

    return userBelongingCount >= amount;
  }
}
