import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
