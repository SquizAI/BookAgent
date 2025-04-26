import { IsString, IsObject, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BookSection {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookSection)
  @IsOptional()
  subsections?: BookSection[];
}

export class GenerationMetadata {
  @IsString()
  generationDate: string;

  @IsString()
  topic: string;

  @IsString()
  gradeLevel: string;

  @IsString()
  version: string;
}

export class GenerationResultDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookSection)
  @IsOptional()
  sections?: BookSection[];

  @IsObject()
  @ValidateNested()
  @Type(() => GenerationMetadata)
  @IsOptional()
  metadata?: GenerationMetadata;
}
