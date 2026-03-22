import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GenerateDesignDto } from './generate-design.dto';

export class BatchGenerateDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one prompt is required' })
  @ArrayMaxSize(4, { message: 'Maximum 4 prompts allowed per batch' })
  @ValidateNested({ each: true })
  @Type(() => GenerateDesignDto)
  prompts: GenerateDesignDto[];
}
