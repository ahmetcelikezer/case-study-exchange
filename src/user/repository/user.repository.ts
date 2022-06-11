import { User } from '../entity/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

export class UserRepository extends EntityRepository<User> {}
