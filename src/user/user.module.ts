import { Module } from '@nestjs/common';
import { User } from './entity/user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserService } from './service/user.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
