import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BuyRequestDTO {
  @IsNotEmpty()
  @IsString()
  stock: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;
}
