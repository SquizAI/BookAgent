import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum JobStatus {
  QUEUED = 'QUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export class GenerationJobDto {
  @IsString()
  jobId: string;

  @IsEnum(JobStatus)
  status: JobStatus;

  @IsString()
  @IsOptional()
  estimatedCompletionTime?: string;

  @IsString()
  @IsOptional()
  message?: string;
}
