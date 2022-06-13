import { TransactionRepository } from '../repository/transaction.repository';
import { StockRepository } from '../repository/stock.repository';
import { TransactionService } from './transaction.service';
import { WalletService } from '../../user/service/wallet.service';
import { Test } from '@nestjs/testing';
import { CreateSellTransactionDTO } from '../dto/create-sell-transaction.dto';
import { faker } from '@faker-js/faker';
import { Stock } from '../entity/stock.entity';
import { User } from '../../user/entity/user.entity';
import { BadRequestException } from '@nestjs/common';
import { CreateBuyTransactionDTO } from '../dto/create-buy-transaction.dto';
import { Transaction } from '../entity/transaction.entity';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionRepository: TransactionRepository;
  let stockRepository: StockRepository;
  let walletService: WalletService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useFactory: () => ({
            findAvailableStocksOnSale: jest.fn(),
            findStockBelongingCount: jest.fn(),
            findAvailableStocksCountOnSale: jest.fn(),
            persist: jest.fn(),
            flush: jest.fn(),
          }),
        },
        {
          provide: StockRepository,
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
        {
          provide: WalletService,
          useFactory: () => ({
            isUserHaveEnoughMoney: jest.fn(),
            transferMoney: jest.fn(),
          }),
        },
      ],
    }).compile();

    transactionService = moduleRef.get(TransactionService);
    transactionRepository = moduleRef.get(TransactionRepository);
    stockRepository = moduleRef.get(StockRepository);
    walletService = moduleRef.get(WalletService);
  });

  describe('sellToMarket', () => {
    it('should create sell transaction', async () => {
      const dto: CreateSellTransactionDTO = {
        amount: 2,
        stock: faker.finance.currencyCode(),
        rate: faker.finance.amount(),
      };

      jest
        .spyOn(stockRepository, 'findOne')
        .mockReturnValue(Promise.resolve(new Stock() as any));
      jest
        .spyOn(transactionRepository, 'findStockBelongingCount')
        .mockReturnValue(Promise.resolve(5));

      const result = await transactionService.sellToMarket(dto, new User());

      expect(result).toBe(true);
    });
    it('should throw error when stock is not exists', async () => {
      const dto: CreateSellTransactionDTO = {
        amount: 2,
        stock: faker.finance.currencyCode(),
        rate: faker.finance.amount(),
      };

      jest
        .spyOn(stockRepository, 'findOne')
        .mockReturnValue(Promise.resolve(null));

      await expect(
        transactionService.sellToMarket(dto, new User()),
      ).rejects.toThrowError(
        new BadRequestException(`Provided stock ${dto.stock} is not valid!`),
      );
    });
    it('should throw error when user does not have enough stock', async () => {
      const dto: CreateSellTransactionDTO = {
        amount: 2,
        stock: faker.finance.currencyCode(),
        rate: faker.finance.amount(),
      };

      jest
        .spyOn(stockRepository, 'findOne')
        .mockReturnValue(Promise.resolve(new Stock() as any));
      jest
        .spyOn(transactionRepository, 'findStockBelongingCount')
        .mockReturnValue(Promise.resolve(1));

      await expect(
        transactionService.sellToMarket(dto, new User()),
      ).rejects.toThrowError(
        new BadRequestException(`You do not have enough stocks to sell!`),
      );
    });
  });
  describe('buyFromMarket', () => {
    it('should create buy transaction', async () => {
      const dto: CreateBuyTransactionDTO = {
        amount: 2,
        stock: faker.finance.currencyCode(),
      };

      const rateOne = '2';
      const rateTwo = '2';

      const transactionOne = new Transaction();
      transactionOne.rate = rateOne;

      const transactionTwo = new Transaction();
      transactionTwo.rate = rateTwo;

      jest
        .spyOn(stockRepository, 'findOne')
        .mockReturnValue(Promise.resolve(new Stock() as any));
      jest
        .spyOn(transactionRepository, 'findAvailableStocksCountOnSale')
        .mockReturnValue(Promise.resolve(5));
      jest
        .spyOn(transactionRepository, 'findAvailableStocksOnSale')
        .mockReturnValue(Promise.resolve([transactionOne, transactionTwo]));
      jest
        .spyOn(walletService, 'isUserHaveEnoughMoney')
        .mockReturnValue(Promise.resolve(true));

      const result = await transactionService.buyFromMarket(dto, new User());

      expect(result).toMatchObject({
        amount: dto.amount,
        outOfBalance: false,
        totalPrice: parseFloat(rateOne) + parseFloat(rateTwo),
      });
    });
    it('should throw error when stock is not exists', async () => {
      const dto: CreateBuyTransactionDTO = {
        amount: 2,
        stock: faker.finance.currencyCode(),
      };

      await expect(
        transactionService.buyFromMarket(dto, new User()),
      ).rejects.toThrowError(
        new BadRequestException(`Provided stock ${dto.stock} is not valid!`),
      );
    });
    it('should throw error when desired amount of stock is not on sale', async () => {
      const dto: CreateBuyTransactionDTO = {
        amount: 2,
        stock: faker.finance.currencyCode(),
      };

      jest
        .spyOn(stockRepository, 'findOne')
        .mockReturnValue(Promise.resolve(new Stock() as any));
      jest
        .spyOn(transactionRepository, 'findAvailableStocksCountOnSale')
        .mockReturnValue(Promise.resolve(1));

      await expect(
        transactionService.buyFromMarket(dto, new User()),
      ).rejects.toThrowError(
        new BadRequestException(`There are not enough ${dto.stock} on sale!`),
      );
    });
    it('should throw error when user does not have enough money', async () => {
      const dto: CreateBuyTransactionDTO = {
        amount: 2,
        stock: faker.finance.currencyCode(),
      };

      jest
        .spyOn(stockRepository, 'findOne')
        .mockReturnValue(Promise.resolve(new Stock() as any));
      jest
        .spyOn(transactionRepository, 'findAvailableStocksCountOnSale')
        .mockReturnValue(Promise.resolve(5));
      jest
        .spyOn(transactionRepository, 'findAvailableStocksOnSale')
        .mockReturnValue(Promise.resolve([new Transaction() as any]));
      jest
        .spyOn(walletService, 'isUserHaveEnoughMoney')
        .mockReturnValue(Promise.resolve(false));

      const result = await transactionService.buyFromMarket(dto, new User());

      expect(result).toMatchObject({
        amount: 0,
        totalPrice: 0,
        outOfBalance: true,
      });
    });
  });
});
