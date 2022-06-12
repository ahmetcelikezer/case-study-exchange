import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class BuyRequestDTO {
  @IsNotEmpty()
  @IsString()
  stock: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  rate: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
