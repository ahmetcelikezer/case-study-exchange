import { WalletService } from './wallet.service';
import { WalletRepository } from '../repository/wallet.repository';
import { Test } from '@nestjs/testing';
import { Wallet } from '../entity/wallet.entity';
import { User } from '../entity/user.entity';

describe('WalletService', () => {
  let walletService: WalletService;
  let walletRepository: WalletRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: WalletRepository,
          useFactory: () => ({
            persistAndFlush: jest.fn(),
          }),
        },
      ],
    }).compile();

    walletService = moduleRef.get<WalletService>(WalletService);
    walletRepository = moduleRef.get<WalletRepository>(WalletRepository);
  });

  describe('isUserHaveEnoughMoney', () => {
    it('should return true when user have enough money', async () => {
      const wallet = new Wallet();
      wallet.balance = '100';

      const user = new User();
      user.wallet = wallet;

      const result = await walletService.isUserHaveEnoughMoney(user, 50);

      expect(result).toBeTruthy();
    });

    it('should return false when user have not enough money', async () => {
      const wallet = new Wallet();
      wallet.balance = '100';

      const user = new User();
      user.wallet = wallet;

      const result = await walletService.isUserHaveEnoughMoney(user, 100.01);

      expect(result).toBeFalsy();
    });
  });
  describe('addMoneyToUser', () => {
    it('should add money to user', async () => {
      const wallet = new Wallet();
      wallet.balance = '100';

      const user = new User();
      user.wallet = wallet;

      await walletService.addMoneyToUser(user, 50);

      expect(wallet.balance).toBe('150.00');
    });
  });
  describe('drawMoney', () => {
    it('should draw money from user', async () => {
      const wallet = new Wallet();
      wallet.balance = '100';

      const user = new User();
      user.wallet = wallet;

      await walletService.drawMoney(user, 50);

      expect(wallet.balance).toBe('50.00');
    });
  });
  describe('transferMoney', () => {
    it('should transfer money from one user to another', async () => {
      const walletOne = new Wallet();
      walletOne.balance = '100';

      const userOne = new User();
      userOne.wallet = walletOne;

      const walletTwo = new Wallet();
      walletTwo.balance = '20';

      const userTwo = new User();
      userTwo.wallet = walletTwo;

      await walletService.transferMoney(userOne, userTwo, 50);

      expect(walletOne.balance).toBe('50.00');
      expect(walletTwo.balance).toBe('70.00');
    });
  });
});
