import { Controller, Post, Body, Get, Param, HttpStatus, HttpException } from '@nestjs/common';
import { GenerateRequestDto } from './dto/generate-request.dto';
import { GenerationJobDto } from './dto/generation-job.dto';
import { GenerationStatusDto } from './dto/generation-status.dto';
import { GenerateService } from './generate.service';

@Controller('api/v1/generate')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post()
  async startGeneration(@Body() generateRequest: GenerateRequestDto): Promise<GenerationJobDto> {
    try {
      return await this.generateService.startGeneration(generateRequest);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to start generation process',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':jobId/status')
  async getGenerationStatus(@Param('jobId') jobId: string): Promise<GenerationStatusDto> {
    try {
      const status = await this.generateService.getGenerationStatus(jobId);
      
      if (!status) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Generation job not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      
      return status;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to retrieve generation status',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
