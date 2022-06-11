import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ValidationPipe } from '../../pipe/validation.pipe';
import { LoginRequestDTO } from '../dto/login-request.dto';
import { AuthService } from '../service/auth.service';
import { RegisterRequestDTO } from '../dto/register-request.dto';
import { LoginResponseDTO } from '../dto/login-response.dto';
import { User } from '../../user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body(new ValidationPipe()) dto: LoginRequestDTO,
  ): Promise<LoginResponseDTO> {
    const user = await this.service.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwt = await this.service.login(user);

    return {
      token: jwt,
      user,
    };
  }

  @Post('register')
  @HttpCode(201)
  async register(
    @Body(new ValidationPipe()) dto: RegisterRequestDTO,
  ): Promise<{ token: string; user: User }> {
    const user = await this.service.register(dto);
    if (!user) {
      throw new ConflictException('User already exists');
    }

    const jwt = await this.service.login(user);

    return {
      token: jwt,
      user,
    };
  }
}
