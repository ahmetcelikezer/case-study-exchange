import {
  Entity,
  EntityRepositoryType, OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { UserRepository } from '../repository/user.repository';
import { Wallet } from './wallet.entity';

@Entity({ customRepository: () => UserRepository })
export class User {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Unique()
  @Property()
  email!: string;

  @Property()
  password!: string;

  @OneToOne({ eager: true })
  wallet: Wallet;

  constructor() {
    this.wallet = new Wallet();
  }
}
