import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { BuyResponseDTO } from '../dto/buy-response.dto';
import { SellResponseDTO } from '../dto/sell-response.dto';
import { TransactionService } from '../service/transaction.service';
import { CurrentUser } from '../../auth/decorator/current-user';
import { User } from '../../user/entity/user.entity';
import { ValidationPipe } from '../../pipe/validation.pipe';
import { SellRequestDTO } from '../dto/sell-request.dto';
import { BuyRequestDTO } from '../dto/buy-request.dto';
import { UserService } from '../../user/service/user.service';

@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
  ) {}

  @Post('buy')
  @HttpCode(200)
  async buy(
    @Body(new ValidationPipe()) dto: BuyRequestDTO,
    @CurrentUser() user: User,
  ): Promise<BuyResponseDTO> {
    user = await this.userService.findById(user.id);
    if (!user) {
      throw new UnauthorizedException('Can not find user');
    }

    const summary = await this.transactionService.buyFromMarket(dto, user);

    return {
      stock: dto.stock,
      estimatedAmount: dto.amount,
      processSummary: {
        totalStocksBought: summary.amount,
        totalPriceSpent: summary.totalPrice,
        isFailedByOutOfBalance: summary.outOfBalance,
      },
    };
  }

  @Post('sell')
  @HttpCode(201)
  async sell(
    @Body(new ValidationPipe()) dto: SellRequestDTO,
    @CurrentUser() user: User,
  ): Promise<SellResponseDTO> {
    user = await this.userService.findById(user.id);
    if (!user) {
      throw new UnauthorizedException('Can not find user');
    }

    await this.transactionService.sellToMarket(dto, user);

    return {
      stock: dto.stock,
      rate: dto.rate,
      amount: dto.amount,
    };
  }
}
