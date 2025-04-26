import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum GradeLevel {
  ELEMENTARY = 'elementary',
  MIDDLE_SCHOOL = 'middle-school',
  HIGH_SCHOOL = 'high-school',
  UNDERGRADUATE = 'undergraduate', 
  GRADUATE = 'graduate'
}

export class GenerateRequestDto {
  @IsString()
  topic: string;

  @IsEnum(GradeLevel)
  gradeLevel: GradeLevel;

  @IsString()
  @IsOptional()
  additionalInstructions?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  userDocuments?: string[]; // Future: IDs or references to uploaded documents
}
