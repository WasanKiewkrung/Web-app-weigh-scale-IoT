import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class MatchPriceDto {
  @IsInt()
  @IsPositive()
  meatType: number;

  @IsNumber()
  @IsPositive()
  weight: number;
}
