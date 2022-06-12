import { Module } from '@nestjs/common';
import { User } from './entity/user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserService } from './service/user.service';
import { Wallet } from './entity/wallet.entity';
import { WalletService } from './service/wallet.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [User, Wallet] })],
  exports: [UserService, WalletService],
  providers: [UserService, WalletService],
})
export class UserModule {}
