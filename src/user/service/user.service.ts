import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDTO } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ email });
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    const user = new User();

    user.email = dto.email;
    user.password = dto.password;

    await this.userRepository.persistAndFlush(user);

    return user;
  }

  async isUserEmailExists(email: string): Promise<boolean> {
    return (await this.userRepository.count({ email })) > 0;
  }
}
