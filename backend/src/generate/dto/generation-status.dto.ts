import { IsString, IsEnum, IsOptional, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { JobStatus } from './generation-job.dto';
import { GenerationResultDto } from './generation-result.dto';

export class GenerationStatusDto {
  @IsString()
  jobId: string;

  @IsEnum(JobStatus)
  status: JobStatus;

  @IsNumber()
  @IsOptional()
  progress?: number; // 0-100

  @IsObject()
  @ValidateNested()
  @Type(() => GenerationResultDto)
  @IsOptional()
  result?: GenerationResultDto;

  @IsString()
  @IsOptional()
  error?: string;
}
