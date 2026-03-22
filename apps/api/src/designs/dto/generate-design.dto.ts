import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class GenerateDesignDto {
  @IsString()
  @MinLength(3, { message: 'Prompt must be at least 3 characters' })
  @MaxLength(1000, { message: 'Prompt must not exceed 1000 characters' })
  prompt: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  style?: string;

  @IsOptional()
  @IsInt()
  @Min(256)
  @Max(1024)
  width?: number;

  @IsOptional()
  @IsInt()
  @Min(256)
  @Max(1024)
  height?: number;
}
