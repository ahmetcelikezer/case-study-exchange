import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SellRequestDTO {
  @IsNotEmpty()
  @IsString()
  stock: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Rate must be a number with 2 decimal places' })
  rate: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(1)
  @IsPositive()
  amount: number;
}
