import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { PartCategory, SwitchType } from '@prisma/client';

export class SearchPartsDto {
  @IsOptional()
  @IsEnum(PartCategory)
  category?: PartCategory;

  @IsOptional()
  @IsEnum(SwitchType)
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
