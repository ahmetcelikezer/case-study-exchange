import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { WalletRepository } from '../repository/wallet.repository';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepository: WalletRepository) {}

  async isUserHaveEnoughMoney(user: User, price: number): Promise<boolean> {
    const wallet = await user.wallet;
    const balance = wallet.getBalanceAsNumber();

    return balance >= price;
  }

  async addMoneyToUser(user: User, price: number): Promise<void> {
    const wallet = await user.wallet;
    wallet.addMoney(price);

    await this.walletRepository.persistAndFlush(wallet);
  }

  async drawMoney(user: User, price: number): Promise<void> {
    const wallet = await user.wallet;
    if (wallet.getBalanceAsNumber() < price) {
      throw new BadRequestException('You dont have enough money');
    }

    wallet.drawMoney(price);
    await this.walletRepository.persistAndFlush(wallet);
  }

  async transferMoney(from: User, to: User, price: number): Promise<void> {
    await this.drawMoney(from, price);
    await this.addMoneyToUser(to, price);
  }
}
