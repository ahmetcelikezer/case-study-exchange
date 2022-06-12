import { Factory, Faker } from '@mikro-orm/seeder';
import { User } from '../../entity/user.entity';
import { PasswordService } from '../../../auth/service/password.service';

export class UserFactory extends Factory<User> {
  model = User;
  private passwordService: PasswordService = new PasswordService();

  protected definition(faker: Faker): Partial<User> {
    return {
      id: faker.datatype.uuid(),
      email: faker.internet.email(),
      password: this.passwordService.hashPasswordSync(
        faker.internet.password(),
      ),
    };
  }
}
