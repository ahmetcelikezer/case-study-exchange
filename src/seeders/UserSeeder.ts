import { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { PasswordService } from '../auth/service/password.service';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { UserFactory } from '../user/factory/entity/user.factory';
import { WalletFactory } from '../user/factory/entity/wallet.factory';
import { User } from '../user/entity/user.entity';
import usersResource from '../../resource/users.json';

const createUserDTOList: CreateUserDTO[] = usersResource;

export class UserSeeder extends Seeder {
  private passwordService = new PasswordService();

  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const users: User[] = [];

    await createUserDTOList.forEach(createUserDTO => {
      const wallet = new WalletFactory(em).makeOne();

      new UserFactory(em)
        .createOne({
          ...createUserDTO,
          wallet,
          password: this.passwordService.hashPasswordSync(
            createUserDTO.password,
          ),
        })
        .then(user => users.push(user));
    });

    context.users = users;
  }
}
