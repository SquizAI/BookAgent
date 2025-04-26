import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly vertexAI: VertexAI;
  private readonly generativeModel: any;

  constructor(private configService: ConfigService) {
    const projectId = this.configService.get<string>('GCP_PROJECT_ID');
    const location = this.configService.get<string>('GCP_LOCATION');
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    // For API key authentication, we need to use a different approach
    // The official VertexAI client doesn't directly support API key auth in its constructor
    // In a production app, we would use Google Cloud service account authentication
    this.vertexAI = new VertexAI({
      project: projectId,
      location: location,
    });
    
    // In a real implementation, we would configure the API key in the request headers
    // or use environment variables with Google Cloud SDK

    // Initialize the Gemini Pro 1.5 model
    this.generativeModel = this.vertexAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });
  }

  /**
   * Generate content using the Director Agent
   */
  async planContent(topic: string, gradeLevel: string, additionalInstructions?: string): Promise<string> {
    try {
      const prompt = this.buildDirectorPrompt(topic, gradeLevel, additionalInstructions);
      const result = await this.generativeModel.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      this.logger.error(`Error in Director Agent planning: ${error.message}`, error.stack);
      throw new Error(`Failed to generate content plan: ${error.message}`);
    }
  }

  /**
   * Generate research content using the Research Agent
   */
  async generateResearch(topic: string, gradeLevel: string): Promise<string> {
    try {
      const prompt = this.buildResearchPrompt(topic, gradeLevel);
      const result = await this.generativeModel.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      this.logger.error(`Error in Research Agent: ${error.message}`, error.stack);
      throw new Error(`Failed to generate research: ${error.message}`);
    }
  }

  /**
   * Generate draft content using the Writer Agent
   */
  async generateDraft(topic: string, gradeLevel: string, research: string, plan: string): Promise<string> {
    try {
      const prompt = this.buildWriterPrompt(topic, gradeLevel, research, plan);
      const result = await this.generativeModel.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      this.logger.error(`Error in Writer Agent: ${error.message}`, error.stack);
      throw new Error(`Failed to generate draft: ${error.message}`);
    }
  }

  /**
   * Build the prompt for the Director Agent
   */
  private buildDirectorPrompt(topic: string, gradeLevel: string, additionalInstructions?: string): string {
    return `
      You are the Director Agent in a multi-agent textbook authoring system. Your role is to plan the structure and content of an educational textbook chapter.
      
      TASK:
      Create a detailed plan for a textbook chapter on "${topic}" for ${gradeLevel} level students.
      
      ${additionalInstructions ? `ADDITIONAL INSTRUCTIONS: ${additionalInstructions}` : ''}
      
      Your plan should include:
      1. A clear title for the chapter
      2. Learning objectives (3-5)
      3. An outline with main sections and subsections
      4. Key concepts to cover in each section
      5. Suggested examples, diagrams, or illustrations
      6. Potential exercises or discussion questions
      
      Format your response as a structured JSON object with the following schema:
      {
        "title": "Chapter Title",
        "learningObjectives": ["objective 1", "objective 2", ...],
        "outline": [
          {
            "sectionTitle": "Section 1",
            "keyConcepts": ["concept 1", "concept 2", ...],
            "subsections": [
              {
                "title": "Subsection 1.1",
                "content": "Description of what should be covered"
              },
              ...
            ]
          },
          ...
        ],
        "visualElements": [
          {
            "type": "diagram/illustration/table",
            "description": "Description of the visual element",
            "purpose": "Educational purpose of this visual"
          },
          ...
        ],
        "exercises": [
          {
            "type": "question/problem/activity",
            "content": "The exercise content",
            "difficulty": "basic/intermediate/advanced"
          },
          ...
        ]
      }
    `;
  }

  /**
   * Build the prompt for the Research Agent
   */
  private buildResearchPrompt(topic: string, gradeLevel: string): string {
    return `
      You are the Research Agent in a multi-agent textbook authoring system. Your role is to gather and synthesize accurate, educational information on a given topic.
      
      TASK:
      Conduct comprehensive research on "${topic}" appropriate for ${gradeLevel} level education.
      
      Your research should:
      1. Focus on factual, educational content
      2. Be appropriate for ${gradeLevel} level students
      3. Include key definitions, theories, principles, and examples
      4. Cite sources where appropriate
      5. Be organized by subtopic
      
      Format your response as a structured JSON object with the following schema:
      {
        "topic": "${topic}",
        "gradeLevel": "${gradeLevel}",
        "keyDefinitions": [
          {
            "term": "Term name",
            "definition": "Clear definition appropriate for this grade level"
          },
          ...
        ],
        "coreConcepts": [
          {
            "concept": "Name of concept",
            "explanation": "Detailed explanation",
            "relevance": "Why this is important to understand"
          },
          ...
        ],
        "factsAndData": [
          {
            "fact": "Specific fact or data point",
            "context": "Contextual information about this fact",
            "source": "Source information if applicable"
          },
          ...
        ],
        "examples": [
          {
            "title": "Example title",
            "description": "Detailed description of the example",
            "application": "How this example illustrates the concept"
          },
          ...
        ]
      }
    `;
  }

  /**
   * Build the prompt for the Writer Agent
   */
  private buildWriterPrompt(topic: string, gradeLevel: string, research: string, plan: string): string {
    return `
      You are the Writer Agent in a multi-agent textbook authoring system. Your role is to create engaging, educational content based on research and a content plan.
      
      TASK:
      Write a textbook chapter on "${topic}" for ${gradeLevel} level students.
      
      Use the following research and plan as your guide:
      
      RESEARCH:
      ${research}
      
      CONTENT PLAN:
      ${plan}
      
      Your writing should:
      1. Be clear, engaging, and appropriate for ${gradeLevel} level students
      2. Follow the structure outlined in the content plan
      3. Incorporate the research accurately
      4. Include appropriate headings, subheadings, and transitions
      5. Use examples, analogies, and explanations to make concepts accessible
      6. Maintain an educational, informative tone
      
      Format your response as a structured JSON object with the following schema:
      {
        "title": "Chapter Title",
        "introduction": "Engaging introduction to the topic",
        "sections": [
          {
            "title": "Section Title",
            "content": "Full text content of this section",
            "subsections": [
              {
                "title": "Subsection Title",
                "content": "Full text content of this subsection"
              },
              ...
            ]
          },
          ...
        ],
        "summary": "Concise summary of key points from the chapter",
        "keyTerms": [
          {
            "term": "Term name",
            "definition": "Definition as used in this chapter"
          },
          ...
        ]
      }
    `;
  }
}
