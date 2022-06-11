import { Module } from '@nestjs/common';
import { User } from './entity/user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserService } from './service/user.service';
import { Wallet } from './entity/wallet.entity';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [User, Wallet] })],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
