# Technical Implementation Plan

## Gemini API Integration

Using API Key: *[Stored securely in environment variables]*

### API Configuration

```javascript
import { GoogleGenAI } from "@google/generative-ai";

// Access API key from environment variables for security
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Select the appropriate model based on task complexity
const researchModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" });
const contentGenModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" });
const editingModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });
```

## Agent Implementation Architecture

### 1. Agent Base Class

```javascript
class Agent {
  constructor(name, role, model) {
    this.name = name;
    this.role = role;
    this.model = model;
    this.memory = [];
    this.taskQueue = [];
  }

  async processTask(task) {
    // Base implementation
    console.log(`Agent ${this.name} processing task: ${task.description}`);
  }

  addToMemory(item) {
    this.memory.push({
      timestamp: new Date(),
      content: item
    });
  }

  generatePrompt(task, context) {
    // Template method to be overridden by specific agents
  }
}
```

### 2. Director Agent Implementation

```javascript
class DirectorAgent extends Agent {
  constructor(model) {
    super("Director", "Orchestration", model);
    this.activeAgents = {};
    this.projectState = {
      currentPhase: "planning",
      completedTasks: [],
      pendingTasks: [],
      issues: []
    };
  }

  async createWorkflow(syllabus, topic) {
    // Parse syllabus and create task workflow
    const parsedSyllabus = await this.parseSyllabus(syllabus);
    const chapterPlan = await this.createChapterPlan(parsedSyllabus, topic);
    
    // Generate tasks for each agent
    return this.generateTasksForAgents(chapterPlan);
  }

  async parseSyllabus(syllabus) {
    const response = await this.model.generateContent({
      contents: [
        { text: `Parse the following syllabus into structured topics, subtopics, and learning objectives. Return as JSON.\n\n${syllabus}` }
      ],
      config: {
        responseMimeType: 'application/json',
        // Schema definition for structured output
      }
    });
    
    return JSON.parse(response.text());
  }

  // Additional methods for workflow management
}
```

### 3. Research Agent Implementation

```javascript
class ResearchAgent extends Agent {
  constructor(model) {
    super("Researcher", "Information Gathering", model);
    this.researchDatabase = {};
    this.sourcesVerified = {};
  }

  async conductResearch(topic, depth) {
    // Use function calling to access external research sources
    const response = await this.model.generateContent({
      contents: [
        { text: `Conduct comprehensive research on ${topic} at depth level ${depth}. Include academic sources, real-world examples, and current developments.` }
      ],
      config: {
        tools: [{
          functionDeclarations: [
            // Function declarations for academic database access
            // Function declarations for case study retrieval
          ]
        }],
      }
    });
    
    // Process and structure research results
    return this.processResearchResults(response);
  }

  async verifyFactualAccuracy(content) {
    // Implementation of multi-source verification
  }
}
```

## System Integration Components

### 1. Knowledge Database Schema

```javascript
const knowledgeSchema = {
  topics: {
    type: "array",
    items: {
      type: "object",
      properties: {
        name: { type: "string" },
        importance: { type: "number" }, // 1-10 scale
        subtopics: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              depth: { type: "number" }, // 1-5 scale
              content: { type: "string" },
              examples: {
                type: "array",
                items: { type: "object" /* example schema */ }
              },
              visuals: {
                type: "array",
                items: { type: "object" /* visual schema */ }
              }
            }
          }
        },
        learningObjectives: {
          type: "array",
          items: { type: "string" }
        }
      }
    }
  },
  sources: {
    type: "array",
    items: {
      type: "object",
      properties: {
        title: { type: "string" },
        authors: { type: "array", items: { type: "string" } },
        year: { type: "number" },
        url: { type: "string" },
        reliability: { type: "number" }, // 1-10 scale
        citationAPA: { type: "string" }
      }
    }
  }
}
```

### 2. Agent Communication Protocol

```javascript
class AgentMessage {
  constructor(sender, recipient, messageType, content, priority = "normal") {
    this.sender = sender;
    this.recipient = recipient;
    this.messageType = messageType; // task, response, question, issue
    this.content = content;
    this.priority = priority; // low, normal, high, critical
    this.timestamp = new Date();
    this.id = generateUniqueId();
    this.conversationId = null; // For threaded conversations
  }

  createResponse(content) {
    return new AgentMessage(
      this.recipient,
      this.sender,
      "response",
      content,
      this.priority
    );
  }
}

class MessageBus {
  constructor() {
    this.subscribers = {};
    this.messageHistory = [];
  }

  subscribe(agent, messageTypes) {
    if (!this.subscribers[agent.name]) {
      this.subscribers[agent.name] = { agent, messageTypes };
    }
  }

  publish(message) {
    this.messageHistory.push(message);
    
    // Direct delivery to specific recipient
    if (message.recipient !== "all" && this.subscribers[message.recipient]) {
      this.subscribers[message.recipient].agent.receiveMessage(message);
      return;
    }
    
    // Broadcast to relevant subscribers
    for (const subscriber of Object.values(this.subscribers)) {
      if (subscriber.messageTypes.includes(message.messageType) || 
          subscriber.messageTypes.includes("all")) {
        subscriber.agent.receiveMessage(message);
      }
    }
  }
}
```

### 3. Chapter Generation Pipeline

```javascript
class ChapterGenerator {
  constructor(agents, messageBus) {
    this.agents = agents;
    this.messageBus = messageBus;
    this.chapterTemplate = loadChapterTemplate();
  }

  async generateChapter(topic, syllabus, professorInput) {
    // 1. Director creates workflow
    const workflow = await this.agents.director.createWorkflow(syllabus, topic);
    
    // 2. Research phase
    const researchTasks = workflow.filter(task => task.phase === "research");
    const researchResults = await this.executeTasksInParallel(researchTasks);
    
    // 3. Content structuring phase
    const contentTasks = this.createContentTasks(workflow, researchResults);
    const contentSections = await this.executeTasksInSequence(contentTasks);
    
    // 4. Writing phase
    const writingTasks = this.createWritingTasks(workflow, contentSections);
    const chapterDraft = await this.executeTasksInSequence(writingTasks);
    
    // 5. Editing and review phase
    const reviewTasks = this.createReviewTasks(workflow, chapterDraft);
    const reviewedChapter = await this.executeTasksInSequence(reviewTasks);
    
    // 6. Finalization
    return this.finalizeChapter(reviewedChapter);
  }

  async executeTasksInParallel(tasks) {
    return Promise.all(tasks.map(task => {
      const agent = this.agents[task.assignedTo];
      return agent.processTask(task);
    }));
  }

  async executeTasksInSequence(tasks) {
    const results = [];
    for (const task of tasks) {
      const agent = this.agents[task.assignedTo];
      const result = await agent.processTask(task);
      results.push(result);
    }
    return results;
  }
}
```

## Quality Assurance Implementation

### 1. Fact-Checking System

```javascript
class FactChecker {
  constructor(model) {
    this.model = model;
    this.verifiedFacts = new Map();
    this.unreliableSources = new Set();
  }

  async verifyFact(fact, providedSources) {
    // Check if already verified
    if (this.verifiedFacts.has(fact)) {
      return this.verifiedFacts.get(fact);
    }
    
    // Multi-source verification
    const verificationResults = await Promise.all(
      providedSources.map(source => this.checkSource(fact, source))
    );
    
    // Additional verification through search
    const searchVerification = await this.performSearchVerification(fact);
    
    // Combine and evaluate results
    const verificationResult = this.evaluateVerification(
      verificationResults, 
      searchVerification
    );
    
    this.verifiedFacts.set(fact, verificationResult);
    return verificationResult;
  }

  async checkSource(fact, source) {
    // Implementation of source reliability assessment
  }

  async performSearchVerification(fact) {
    // Use Gemini's search grounding capability
    const response = await this.model.generateContent({
      contents: [{ text: `Verify the following fact using reliable sources: "${fact}"` }],
      config: {
        tools: [{ searchGrounding: true }]
      }
    });
    
    return this.parseSearchResults(response);
  }
}
```

### 2. Pedagogical Effectiveness Evaluator

```javascript
class PedagogicalEvaluator {
  constructor(model) {
    this.model = model;
    this.evaluationCriteria = {
      clarity: { weight: 0.2, description: "Clarity of explanations" },
      engagement: { weight: 0.15, description: "Student engagement potential" },
      scaffolding: { weight: 0.15, description: "Progressive concept building" },
      applicationFocus: { weight: 0.2, description: "Real-world application" },
      assessmentAlignment: { weight: 0.15, description: "Alignment with objectives" },
      accessibility: { weight: 0.15, description: "Appropriate for audience" }
    };
  }

  async evaluateContent(content, learningObjectives, audience) {
    const response = await this.model.generateContent({
      contents: [{
        text: `Evaluate the following educational content for pedagogical effectiveness. 
        Learning Objectives: ${JSON.stringify(learningObjectives)}
        Target Audience: ${audience}
        
        Content:
        ${content}
        
        Provide scores (1-10) and specific feedback for each criterion:
        - Clarity
        - Engagement
        - Scaffolding
        - Application Focus
        - Assessment Alignment
        - Accessibility`
      }],
      config: {
        responseMimeType: 'application/json',
        // Schema for structured evaluation
      }
    });
    
    const evaluation = JSON.parse(response.text());
    return this.calculateEffectivenessScore(evaluation);
  }

  calculateEffectivenessScore(evaluation) {
    let weightedScore = 0;
    const feedback = {};
    
    for (const [criterion, details] of Object.entries(this.evaluationCriteria)) {
      const score = evaluation[criterion].score;
      weightedScore += score * details.weight;
      feedback[criterion] = evaluation[criterion].feedback;
    }
    
    return {
      overallScore: weightedScore,
      criteriaScores: evaluation,
      feedback,
      improvementSuggestions: evaluation.suggestions
    };
  }
}
```

## Professor Interaction System

```javascript
class ProfessorInteractionSystem {
  constructor(model) {
    this.model = model;
    this.conversationHistory = [];
    this.extractedInsights = {};
  }

  async generateQuestions(syllabus, topic) {
    const response = await this.model.generateContent({
      contents: [{
        text: `Based on this syllabus and topic, generate a set of targeted questions to ask a professor to gather insights for creating an effective textbook chapter.
        
        Syllabus: ${syllabus}
        Topic: ${topic}
        
        Generate questions that will elicit:
        1. Key concepts that should be emphasized
        2. Common student misconceptions or difficulties
        3. Preferred teaching approaches
        4. Recommended real-world examples
        5. Appropriate depth for subtopics
        6. Assessment strategies`
      }],
      config: {
        responseMimeType: 'application/json',
        // Schema for structured questions
      }
    });
    
    return JSON.parse(response.text());
  }

  async processResponse(question, response) {
    this.conversationHistory.push({ question, response, timestamp: new Date() });
    
    // Extract insights from professor response
    const analysis = await this.model.generateContent({
      contents: [{
        text: `Extract key insights from this professor's response to inform textbook chapter development:
        
        Question: ${question}
        Response: ${response}
        
        Categorize insights by:
        - Content priorities
        - Pedagogical approaches
        - Examples to include
        - Depth recommendations
        - Assessment strategies`
      }],
      config: {
        responseMimeType: 'application/json',
        // Schema for structured insights
      }
    });
    
    const insights = JSON.parse(analysis.text());
    this.updateExtractedInsights(insights);
    
    // Generate follow-up questions if needed
    return this.generateFollowUpQuestions(question, response, insights);
  }

  updateExtractedInsights(newInsights) {
    // Merge new insights with existing ones
    for (const category in newInsights) {
      if (!this.extractedInsights[category]) {
        this.extractedInsights[category] = [];
      }
      
      this.extractedInsights[category] = [
        ...this.extractedInsights[category],
        ...newInsights[category]
      ];
    }
  }
}
```

## Phase 1 Technical Implementation Details

This section details the technical choices and approaches for Phase 1: Foundational Framework & Core Generation, as outlined in the [BookAgent_Roadmap.md](./BookAgent_Roadmap.md).

### 1. Core Technology Stack (Milestone 1.1)

*   **Frontend Framework:** React (with Typescript recommended for type safety).
*   **Backend Language/Platform:** Node.js (with Typescript recommended).
*   **Backend Framework:** NestJS (Chosen for its strong structure, TypeScript-first approach, and suitability for complex, scalable applications like BookAgent).
*   **API Communication:** RESTful APIs using NestJS conventions (Controllers, DTOs). GraphQL could be considered later if frontend data needs become complex.
*   **Cloud Provider:** Google Cloud Platform (GCP) (Leveraging native integration with Google AI services like Vertex AI / Gemini API).
*   **Database:** PostgreSQL (Robust, open-source relational database for structured data like user info, project metadata) and potentially a Vector Database (e.g., Pinecone, ChromaDB, PGVector) for RAG capabilities later.
*   **Containerization:** Docker (For consistent development and deployment environments).
*   **Orchestration:** Kubernetes (via Google Kubernetes Engine - GKE) for scalable deployment (may be overkill for Phase 1, could start simpler using Cloud Run or App Engine).
*   **Version Control:** Git (Hosted on GitHub/GitLab/Bitbucket).

### 2. Initial Agent Implementation (Milestone 1.2)

*   **Agent Logic Implementation:** Primarily within the Node.js backend services.
*   **Agent Framework Consideration:** While LangChain has a JS version (Langchain.js), evaluate if its abstractions fit well or if a custom agent orchestration logic is preferable within the Node.js environment. Libraries like `@google-cloud/aiplatform` will be used for direct Gemini interaction.
*   **Core Agents (Phase 1):**
    *   `DirectorAgent`: Manages overall workflow state, receives user input via API calls from the React frontend, delegates tasks to other backend services/functions. Might be implemented as a state machine or workflow engine (e.g., using Temporal.io, or simpler logic initially).
    *   `ResearchAgent`: Backend service/function taking topic input, formulating queries for Gemini via Node.js client library, processing results.
    *   `WriterAgent`: Backend service/function taking research input/outline, generating draft text using Gemini via Node.js client library.
*   **Agent Communication:** Primarily asynchronous API calls between backend services or using a message queue (e.g., Google Cloud Pub/Sub, Redis Pub/Sub) for decoupling tasks.
*   **State Management:** Store workflow state (current step, agent tasks, intermediate results) in PostgreSQL or potentially Firestore/Cloud Tasks for simpler state tracking.

### 3. Basic Gemini API Integration (Milestone 1.2)

*   **API Access:** Utilize the official Google Cloud AI Platform Node.js Client Library (`@google-cloud/aiplatform`).
*   **Authentication:** Service Account Keys managed securely or Workload Identity Federation for secure access from GCP services (e.g., Cloud Run, GKE).
*   **Key Models (Initial):** Gemini 1.5 Pro (for its large context window and reasoning capabilities) accessed via Vertex AI endpoint.
*   **Initial Prompting Strategy:** 
    *   Develop clear, structured prompts passed from Node.js backend to the Gemini API for ResearchAgent and WriterAgent tasks.
    *   Employ basic few-shot prompting where applicable.
    *   Manage context window limitations within the Node.js service logic.
*   **Error Handling:** Implement robust error handling (try/catch, status checks) for API calls within Node.js services.
*   **Cost Management:** Set up monitoring in GCP and potentially budget alerts for API usage.
*   *(Reference: [gemini_api_development_plan.md](./gemini_api_development_plan.md) for broader API strategy)*

### 4. Phase 1 API Schemas (NestJS)

This section defines the initial REST API endpoints and Data Transfer Objects (DTOs) for communication between the React frontend and the NestJS backend during the Phase 1 workflow.

**Module:** `GenerationModule` (Example name)

**Controller:** `GenerationController` (Example path: `/api/v1/generate`)

**Endpoint 1: Start Generation Process**

*   **HTTP Method:** `POST`
*   **Path:** `/` (relative to controller path, so `/api/v1/generate`)
*   **Description:** Initiates the book section generation process based on user input.
*   **Request Body DTO:** `GenerateRequestDto`
    ```typescript
    import { IsString, IsOptional, IsArray, ArrayNotEmpty, Length } from 'class-validator';

    export class GenerateRequestDto {
      @IsString()
      @Length(10, 500) // Example length constraints
      topic: string; // The main topic or prompt

      @IsOptional()
      @IsString()
      @Length(3, 100)
      targetAudience?: string;

      @IsOptional()
      @IsString()
      @Length(3, 50)
      approxLength?: string; // e.g., "1 page", "500 words"

      @IsOptional()
      @IsArray()
      @ArrayNotEmpty()
      @IsString({ each: true })
      keyPoints?: string[]; // Optional key points to include
    }
    ```
*   **Response Body DTO:** `GenerationJobDto`
    ```typescript
    import { IsUUID } from 'class-validator';

    export class GenerationJobDto {
      @IsUUID()
      jobId: string; // Unique identifier for the generation task
    }
    ```
*   **Functionality:** The controller method receives the `GenerateRequestDto`, validates it, initiates the generation workflow (likely by calling a `GenerationService`), persists the initial job state, and returns the `jobId`.

**Endpoint 2: Get Generation Status & Result**

*   **HTTP Method:** `GET`
*   **Path:** `/:jobId/status` (e.g., `/api/v1/generate/uuid-1234/status`)
*   **Description:** Retrieves the current status and result (if available) of a specific generation job.
*   **Path Parameter:** `jobId` (string, likely UUID)
*   **Response Body DTO:** `GenerationStatusDto`
    ```typescript
    import { IsUUID, IsEnum, IsString, IsOptional } from 'class-validator';

    export enum GenerationStatus {
      PENDING = 'PENDING',
      PROCESSING = 'PROCESSING',
      COMPLETED = 'COMPLETED',
      FAILED = 'FAILED',
    }

    export class GenerationStatusDto {
      @IsUUID()
      jobId: string;

      @IsEnum(GenerationStatus)
      status: GenerationStatus;

      @IsOptional()
      @IsString()
      result?: string; // The generated text, present if status is COMPLETED

      @IsOptional()
      @IsString()
      error?: string; // Error message, present if status is FAILED
    }
    ```
*   **Functionality:** The controller method takes the `jobId`, retrieves the job's current status and associated data (result or error) from the `GenerationService` or data store, and returns the `GenerationStatusDto`.

*(Note: This defines the core synchronous request/response. For a better UX, the frontend might poll the status endpoint, or WebSockets could be implemented later for real-time updates.)*

## Next Steps

1. Implement the core agent architecture
2. Develop the knowledge database schema
3. Create the professor interaction system
4. Build the research orchestration engine
5. Develop the chapter generation pipeline
6. Implement the quality assurance systems
7. Create the integration and testing framework
