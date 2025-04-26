import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { GenerateRequestDto } from './dto/generate-request.dto';
import { GenerationJobDto, JobStatus } from './dto/generation-job.dto';
import { GenerationStatusDto } from './dto/generation-status.dto';
import { GenerationResultDto, BookSection } from './dto/generation-result.dto';
import { GeminiService } from './gemini.service';

// We'll add actual Gemini API integration in a separate service
// For now, this is a placeholder that simulates the generation process
@Injectable()
export class GenerateService {
  private readonly logger = new Logger(GenerateService.name);
  private activeJobs = new Map<string, any>();
  
  constructor(
    private configService: ConfigService,
    private geminiService: GeminiService
  ) {}

  async startGeneration(request: GenerateRequestDto): Promise<GenerationJobDto> {
    this.logger.log(`Starting generation for topic: ${request.topic}`);
    
    // Generate a unique job ID
    const jobId = uuidv4();
    
    // Create a new job entry
    const job = {
      jobId,
      status: JobStatus.QUEUED,
      request,
      createdAt: new Date(),
      // In a real implementation, we would store this in a database
    };
    
    // Store job in memory (would be in a database in production)
    this.activeJobs.set(jobId, job);
    
    // Simulate async processing (in a real app, this would be a background job)
    setTimeout(() => this.processGenerationJob(jobId), 1000);
    
    return {
      jobId,
      status: JobStatus.QUEUED,
      estimatedCompletionTime: new Date(Date.now() + 60000).toISOString(), // Simulate 60s completion time
      message: 'Generation job queued successfully',
    };
  }

  async getGenerationStatus(jobId: string): Promise<GenerationStatusDto | null> {
    const job = this.activeJobs.get(jobId);
    
    if (!job) {
      return null;
    }
    
    const response: GenerationStatusDto = {
      jobId,
      status: job.status,
    };
    
    if (job.progress !== undefined) {
      response.progress = job.progress;
    }
    
    if (job.result) {
      response.result = job.result;
    }
    
    if (job.error) {
      response.error = job.error;
    }
    
    return response;
  }
  
  // Process the generation job using the multi-agent system
  private async processGenerationJob(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    
    if (!job) {
      return;
    }
    
    try {
      // Update job status to in progress
      job.status = JobStatus.IN_PROGRESS;
      job.progress = 0;
      this.logger.log(`Starting generation process for job ${jobId} on topic: ${job.request.topic}`);
      
      // Step 1: Director Agent - Plan the content
      job.progress = 10;
      this.logger.log(`Director Agent planning content for job ${jobId}`);
      let contentPlan = '';
      try {
        contentPlan = await this.geminiService.planContent(
          job.request.topic,
          job.request.gradeLevel,
          job.request.additionalInstructions
        );
      } catch (error) {
        // If Gemini API fails, use a fallback plan
        this.logger.warn(`Director Agent failed, using fallback plan: ${error.message}`);
        contentPlan = JSON.stringify({
          title: `Understanding ${job.request.topic}`,
          learningObjectives: [
            `Understand the basic concepts of ${job.request.topic}`,
            `Identify key components of ${job.request.topic}`,
            `Apply knowledge of ${job.request.topic} to solve problems`
          ],
          outline: [
            {
              sectionTitle: "Introduction",
              keyConcepts: [`Overview of ${job.request.topic}`],
              subsections: []
            },
            {
              sectionTitle: "Main Concepts",
              keyConcepts: ["Key principles", "Important theories"],
              subsections: [
                {
                  title: "Key Concept 1",
                  content: "Explanation of first key concept"
                },
                {
                  title: "Key Concept 2",
                  content: "Explanation of second key concept"
                }
              ]
            },
            {
              sectionTitle: "Applications",
              keyConcepts: ["Practical uses", "Real-world examples"],
              subsections: []
            },
            {
              sectionTitle: "Summary",
              keyConcepts: ["Review of key points"],
              subsections: []
            }
          ]
        });
      }
      
      // Step 2: Research Agent - Generate research content
      job.progress = 30;
      this.logger.log(`Research Agent gathering information for job ${jobId}`);
      let researchContent = '';
      try {
        researchContent = await this.geminiService.generateResearch(
          job.request.topic,
          job.request.gradeLevel
        );
      } catch (error) {
        // If Gemini API fails, use a fallback research content
        this.logger.warn(`Research Agent failed, using fallback research: ${error.message}`);
        researchContent = JSON.stringify({
          topic: job.request.topic,
          gradeLevel: job.request.gradeLevel,
          keyDefinitions: [
            {
              term: job.request.topic,
              definition: `Basic definition of ${job.request.topic}`
            }
          ],
          coreConcepts: [
            {
              concept: "Main principle",
              explanation: "Explanation of the main principle",
              relevance: "Why this is important to understand"
            }
          ],
          factsAndData: [
            {
              fact: "Important fact about the topic",
              context: "Context for this fact",
              source: "General knowledge"
            }
          ]
        });
      }
      
      // Step 3: Writer Agent - Generate the draft content
      job.progress = 60;
      this.logger.log(`Writer Agent creating content for job ${jobId}`);
      let draftContent = '';
      try {
        draftContent = await this.geminiService.generateDraft(
          job.request.topic,
          job.request.gradeLevel,
          researchContent,
          contentPlan
        );
      } catch (error) {
        // If Gemini API fails, use a fallback draft
        this.logger.warn(`Writer Agent failed, using fallback content: ${error.message}`);
        draftContent = JSON.stringify({
          title: `Understanding ${job.request.topic}`,
          introduction: `Introduction to ${job.request.topic} for ${job.request.gradeLevel} level students.`,
          sections: [
            {
              title: "Introduction",
              content: `This chapter introduces ${job.request.topic} and its importance.`
            },
            {
              title: "Main Concepts",
              content: "This section covers the core concepts of the topic.",
              subsections: [
                {
                  title: "Key Concept 1",
                  content: "Detailed explanation of the first key concept."
                },
                {
                  title: "Key Concept 2",
                  content: "Detailed explanation of the second key concept."
                }
              ]
            },
            {
              title: "Summary",
              content: "This chapter covered the fundamental aspects of the topic."
            }
          ],
          summary: "A brief recap of what was covered in this chapter.",
          keyTerms: [
            {
              term: "Important term",
              definition: "Definition of this important term"
            }
          ]
        });
      }
      
      // Step 4: Process the draft content into the final result format
      job.progress = 90;
      this.logger.log(`Finalizing content for job ${jobId}`);
      
      let parsedDraft;
      try {
        parsedDraft = JSON.parse(draftContent);
      } catch (error) {
        this.logger.warn(`Failed to parse draft content as JSON: ${error.message}`);
        // Create a simple structure if parsing fails
        parsedDraft = {
          title: `Understanding ${job.request.topic}`,
          introduction: `Introduction to ${job.request.topic}.`,
          sections: [
            {
              title: "Content",
              content: draftContent.substring(0, 1000) + "..."
            }
          ],
          summary: "Summary of the content."
        };
      }
      
      // Convert the parsed draft into our DTO format
      const sections: BookSection[] = [];
      
      // Add introduction section
      if (parsedDraft.introduction) {
        sections.push({
          title: "Introduction",
          content: parsedDraft.introduction
        });
      }
      
      // Add main content sections
      if (parsedDraft.sections && Array.isArray(parsedDraft.sections)) {
        for (const section of parsedDraft.sections) {
          const bookSection: BookSection = {
            title: section.title,
            content: section.content
          };
          
          // Add subsections if they exist
          if (section.subsections && Array.isArray(section.subsections)) {
            bookSection.subsections = section.subsections.map(sub => ({
              title: sub.title,
              content: sub.content
            }));
          }
          
          sections.push(bookSection);
        }
      }
      
      // Add summary section if it exists
      if (parsedDraft.summary) {
        sections.push({
          title: "Summary",
          content: parsedDraft.summary
        });
      }
      
      // Create the final result
      const result: GenerationResultDto = {
        title: parsedDraft.title || `Understanding ${job.request.topic}`,
        content: parsedDraft.introduction || "",
        sections: sections,
        metadata: {
          generationDate: new Date().toISOString(),
          topic: job.request.topic,
          gradeLevel: job.request.gradeLevel,
          version: '0.1.0'
        }
      };
      
      // Update job with result
      job.status = JobStatus.COMPLETED;
      job.progress = 100;
      job.result = result;
      job.completedAt = new Date();
      
      this.logger.log(`Generation completed for job ${jobId}`);
    } catch (error) {
      // Handle errors
      job.status = JobStatus.FAILED;
      job.error = error.message;
      job.completedAt = new Date();
      
      this.logger.error(`Generation failed for job ${jobId}: ${error.message}`, error.stack);
    }
  }
  
  // Helper method for delays
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
