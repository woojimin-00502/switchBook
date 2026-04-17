import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export type PartCategory = 'switch' | 'housing' | 'plate';
export type SwitchType = 'LINEAR' | 'TACTILE' | 'CLICKY';

export class SearchPartsDto {
  @IsOptional()
  @IsIn(['switch', 'housing', 'plate'])
  category?: PartCategory;

  @IsOptional()
  @IsIn(['LINEAR', 'TACTILE', 'CLICKY'])
  type?: SwitchType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minG?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxG?: number;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 24;
}
