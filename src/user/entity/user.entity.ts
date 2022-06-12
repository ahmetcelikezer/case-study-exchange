import {
  Entity,
  EntityRepositoryType,
  LoadStrategy,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
  UuidType,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { UserRepository } from '../repository/user.repository';
import { Wallet } from './wallet.entity';

@Entity({ customRepository: () => UserRepository })
export class User {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey({ type: UuidType })
  id: string;

  @Unique()
  @Property()
  email!: string;

  @Property()
  password!: string;

  @OneToOne({ eager: true })
  wallet: Wallet;

  constructor() {
    this.id = v4();
    this.wallet = new Wallet();
  }
}
