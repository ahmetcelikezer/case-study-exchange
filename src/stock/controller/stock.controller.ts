import {
  Body,
  Controller,
  HttpCode, NotImplementedException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { BuyResponseDTO } from '../dto/buy-response.dto';
import { SellResponseDTO } from '../dto/sell-response.dto';
import { TransactionService } from '../service/transaction.service';
import { CurrentUser } from '../decorator/current-user';
import { User } from '../../user/entity/user.entity';
import { ValidationPipe } from '../../pipe/validation.pipe';
import { SellRequestDTO } from '../dto/sell-request.dto';

@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('buy')
  @HttpCode(200)
  async buy(): Promise<BuyResponseDTO> {
    throw new NotImplementedException('Not implemented');
  }

  @Post('sell')
  @HttpCode(201)
  async sell(
    @Body(new ValidationPipe()) dto: SellRequestDTO,
    @CurrentUser() user: User,
  ): Promise<SellResponseDTO> {
    if (!user) {
      throw new UnauthorizedException('Can not find user');
    }
    const transaction = await this.transactionService.createSellTransaction(
      dto,
      user,
    );

    return {
      stock: transaction.stock.symbol,
      rate: transaction.rate,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
    };
  }
}
