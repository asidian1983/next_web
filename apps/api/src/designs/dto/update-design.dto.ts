import { IsString, IsOptional, IsBoolean, IsArray, MaxLength } from 'class-validator';

export class UpdateDesignDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  style?: string;
}
