import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SellRequestDTO {
  @IsNotEmpty()
  @IsString()
  stock: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  rate: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;
}
