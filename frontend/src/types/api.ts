/**
 * API Types for BookAgent Frontend
 * These interfaces match the backend DTOs to ensure type safety
 */

// Request types
export interface GenerateRequestDto {
  topic: string;
  gradeLevel: string;
  additionalInstructions?: string;
  userDocuments?: string[]; // Future: IDs or references to uploaded documents
}

// Response types
export interface GenerationJobDto {
  jobId: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  estimatedCompletionTime?: string;
  message?: string;
}

export interface GenerationStatusDto {
  jobId: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress?: number; // 0-100
  result?: GenerationResultDto;
  error?: string;
}

export interface GenerationResultDto {
  title?: string;
  content?: string;
  sections?: BookSection[];
  metadata?: {
    generationDate: string;
    topic: string;
    gradeLevel: string;
    version: string;
  };
}

export interface BookSection {
  title: string;
  content: string;
  subsections?: BookSection[];
}
