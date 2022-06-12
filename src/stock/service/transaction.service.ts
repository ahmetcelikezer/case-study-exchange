import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repository/transaction.repository';
import { CreateSellTransactionDTO } from '../dto/create-sell-transaction.dto';
import { Transaction } from '../entity/transaction.entity';
import { User } from '../../user/entity/user.entity';
import { StockRepository } from '../repository/stock.repository';
import { WalletService } from '../../user/service/wallet.service';
import { Stock } from '../entity/stock.entity';
import { CreateBuyTransactionDTO } from '../dto/create-buy-transaction.dto';

type CreateTransactionsParameters = {
  user: User;
  stock: Stock;
  rate: number;
};

type ProcessedTransaction = {
  amount: number;
  totalPrice: number;
  outOfBalance: boolean;
};

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly stockRepository: StockRepository,
    private readonly walletService: WalletService,
  ) {}

  async sellToMarket(
    dto: CreateSellTransactionDTO,
    user: User,
  ): Promise<boolean> {
    const stock = await this.stockRepository.findOne({ symbol: dto.stock });
    if (!stock) {
      throw new BadRequestException(
        `Provided stock ${dto.stock} is not valid!`,
      );
    }

    const canUserSell = await this.canSell(user, stock, dto.amount);
    if (!canUserSell) {
      throw new BadRequestException(`You do not have enough stocks to sell!`);
    }

    await this.createSellTransactions(
      { user, stock, rate: parseFloat(dto.rate) },
      dto.amount,
    );

    return true;
  }

  async buyFromMarket(
    dto: CreateBuyTransactionDTO,
    user: User,
  ): Promise<ProcessedTransaction> {
    const stock = await this.stockRepository.findOne({ symbol: dto.stock });
    if (!stock) {
      throw new BadRequestException(
        `Provided stock ${dto.stock} is not valid!`,
      );
    }

    const enoughStocksOnSale = await this.isRequestedAmountOnSale(
      stock,
      dto.amount,
    );
    if (!enoughStocksOnSale) {
      throw new BadRequestException(
        `There are not enough ${dto.stock} on sale!`,
      );
    }

    const availableTransactions = await this.transactionRepository.findAvailableStocksOnSale(
      stock,
      dto.amount,
    );

    return await this.processBuyTransactions(availableTransactions, user);
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

  private async isRequestedAmountOnSale(
    stock: Stock,
    amount: number,
  ): Promise<boolean> {
    const availableCount = await this.transactionRepository.findAvailableStocksCountOnSale(
      stock,
    );
    return availableCount >= amount;
  }

  private async createSellTransactions(
    data: CreateTransactionsParameters,
    amount: number,
  ): Promise<void> {
    for (let i = 0; i < amount; i++) {
      const transaction = new Transaction();

      transaction.stock = data.stock;
      transaction.from = data.user;
      transaction.rate = data.rate.toString();

      this.transactionRepository.persist(transaction);
    }
    await this.transactionRepository.flush();
  }

  private async processBuyTransactions(
    transactions: Transaction[],
    user: User,
  ): Promise<ProcessedTransaction> {
    const processedTransactions: ProcessedTransaction = {
      amount: 0,
      totalPrice: 0,
      outOfBalance: false,
    };

    for (const transaction of transactions) {
      const price = parseFloat(transaction.rate);
      const userHaveEnoughBalance = await this.walletService.isUserHaveEnoughMoney(
        user,
        price,
      );

      if (!userHaveEnoughBalance) {
        processedTransactions.outOfBalance = true;
        break;
      }

      await this.walletService.transferMoney(user, transaction.from, price);
      transaction.to = user;

      this.transactionRepository.persist(transaction);
      processedTransactions.amount++;
      processedTransactions.totalPrice += price;
    }

    await this.transactionRepository.flush();

    return processedTransactions;
  }
}
