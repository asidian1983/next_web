import { IsString, IsOptional, IsArray, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class QueryDesignsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((t: string) => t.trim()) : value,
  )
  tags?: string[];

  @IsOptional()
  @IsString()
  style?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
