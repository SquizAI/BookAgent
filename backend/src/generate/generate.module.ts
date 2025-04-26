import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';
import { GeminiService } from './gemini.service';

@Module({
  controllers: [GenerateController],
  providers: [GenerateService, GeminiService],
  exports: [GenerateService, GeminiService]
})
export class GenerateModule {}
