import { CreateUserDTO } from '../../src/user/dto/create-user.dto';
import { User } from '../../src/user/entity/user.entity';
import { PasswordService } from '../../src/auth/service/password.service';
import { SqlEntityRepository } from '@mikro-orm/postgresql';

export const createUserHelper = async (
  repository: SqlEntityRepository<typeof User>,
  data: CreateUserDTO,
) => {
  const user = new User();
  const passwordService = new PasswordService();

  user.email = data.email;
  user.password = await passwordService.hashPassword(data.password);

  await repository.persistAndFlush(user);

  return user;
};
