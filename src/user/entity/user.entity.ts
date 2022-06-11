import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { UserRepository } from '../repository/user.repository';

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
}
