import { EntityRepository } from '@mikro-orm/postgresql';
import { Wallet } from '../entity/wallet.entity';

export class WalletRepository extends EntityRepository<Wallet> {}
