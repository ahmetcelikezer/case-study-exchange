import { StockController } from './stock.controller';
import { TransactionService } from '../service/transaction.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/service/user.service';
import { BuyRequestDTO } from '../dto/buy-request.dto';
import { faker } from '@faker-js/faker';
import { User } from '../../user/entity/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { SellRequestDTO } from '../dto/sell-request.dto';

describe('StockController', () => {
  let stockController: StockController;
  let transactionService: TransactionService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TransactionService,
          useFactory: jest.fn(() => ({
            buyFromMarket: jest.fn(),
            sellToMarket: jest.fn(),
          })),
        },
        {
          provide: UserService,
          useFactory: jest.fn(() => ({
            findById: jest.fn(),
          })),
        },
      ],
      controllers: [StockController],
    }).compile();

    stockController = moduleRef.get<StockController>(StockController);
    transactionService = moduleRef.get<TransactionService>(TransactionService);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('buy', () => {
    it('should buy when valid data', async () => {
      const requestData: BuyRequestDTO = {
        stock: faker.finance.currencyCode(),
        amount: faker.datatype.number({ min: 1, max: 100 }),
      };

      const processSummary = {
        amount: faker.finance.amount().toString(),
        totalPrice: faker.finance.amount().toString(),
        outOfBalance: false,
      };

      jest
        .spyOn(userService, 'findById')
        .mockReturnValue(Promise.resolve(new User()));
      jest
        .spyOn(transactionService, 'buyFromMarket')
        .mockReturnValue(Promise.resolve(processSummary as any));

      const response = await stockController.buy(requestData, {
        id: faker.datatype.uuid(),
      } as User);

      await expect(response).toMatchObject({
        stock: requestData.stock,
        estimatedAmount: requestData.amount,
        processSummary: {
          totalStocksBought: processSummary.amount,
          totalPriceSpent: processSummary.totalPrice,
          isFailedByOutOfBalance: processSummary.outOfBalance,
        },
      });
    });

    it('should throw unauthorized exception when user not matched', async () => {
      const requestData: BuyRequestDTO = {
        stock: faker.finance.currencyCode(),
        amount: faker.datatype.number({ min: 1, max: 100 }),
      };

      jest
        .spyOn(userService, 'findById')
        .mockReturnValue(Promise.resolve(undefined));

      await expect(
        stockController.buy(requestData, { id: faker.datatype.uuid() } as User),
      ).rejects.toThrowError(new UnauthorizedException('Can not find user'));
    });
  });

  describe('sell', () => {
    it('should sell when valid data', async () => {
      const requestData: SellRequestDTO = {
        amount: faker.datatype.number({ min: 1, max: 100 }),
        stock: faker.finance.currencyCode(),
        rate: faker.finance.amount().toString(),
      };

      jest
        .spyOn(userService, 'findById')
        .mockReturnValue(Promise.resolve(new User()));
      jest
        .spyOn(transactionService, 'sellToMarket')
        .mockReturnValue(Promise.resolve(true));

      const response = await stockController.sell(requestData, {
        id: faker.datatype.uuid(),
      } as User);

      expect(response).toMatchObject({
        stock: requestData.stock,
        rate: requestData.rate,
        amount: requestData.amount,
      });
    });
    it('should throw unauthorized exception when user not matched', async () => {
      const requestData: SellRequestDTO = {
        amount: faker.datatype.number({ min: 1, max: 100 }),
        stock: faker.finance.currencyCode(),
        rate: faker.finance.amount().toString(),
      };

      jest
        .spyOn(userService, 'findById')
        .mockReturnValue(Promise.resolve(undefined));

      await expect(
        stockController.sell(requestData, {
          id: faker.datatype.uuid(),
        } as User),
      ).rejects.toThrowError(new UnauthorizedException('Can not find user'));
    });
  });
});
