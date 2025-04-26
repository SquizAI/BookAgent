# Gemini API - Gemini 2.5 Preview Models

This document summarizes the capabilities and details of the Gemini 2.5 Preview models relevant for integration into the VibeFlow application.

## Available Preview Models

| Model Variant                 | Model ID                         | Input(s)                          | Output | Optimized For                                                               |
| :---------------------------- | :------------------------------- | :-------------------------------- | :----- | :-------------------------------------------------------------------------- |
| **Gemini 2.5 Flash Preview**  | `gemini-2.5-flash-preview-04-17` | Audio, images, videos, and text | Text   | Adaptive thinking, cost efficiency                                          |
| **Gemini 2.5 Pro Preview**    | `gemini-2.5-pro-preview-03-25`   | Audio, images, videos, and text | Text   | Enhanced thinking and reasoning, multimodal understanding, advanced coding |

**Note:** Both models are currently in **Preview**. This means:
*   They may have more restricted rate limits compared to stable models.
*   Features and capabilities might change before the final release.

## Key Features & Details

### Gemini 2.5 Flash Preview (`gemini-2.5-flash-preview-04-17`)

*   **Description:** Google's best model for price-performance, offering well-rounded capabilities.
*   **Inputs:** Text, images, video, audio
*   **Output:** Text
*   **Input Token Limit:** 1,048,576
*   **Output Token Limit:** 65,536
*   **Supported Features:**
    *   Function Calling
    *   Code Execution
    *   Search Grounding
    *   Structured Outputs
    *   Thinking
*   **Not Supported:** Caching, Tuning, Image Generation, Audio Generation

### Gemini 2.5 Pro Preview (`gemini-2.5-pro-preview-03-25`)

*   **Description:** Google's state-of-the-art thinking model, capable of reasoning over complex problems (code, math, STEM) and analyzing large datasets/documents.
*   **Inputs:** Text, images, video, audio
*   **Output:** Text
*   **Input Token Limit:** 1,048,576
*   **Output Token Limit:** 65,536
*   **Supported Features:**
    *   Caching
    *   Function Calling
    *   Code Execution
    *   Search Grounding
    *   Structured Outputs
    *   Thinking
*   **Not Supported:** Tuning, Image Generation, Audio Generation

## Integration Notes (Node.js/React)

*   Use the `@google/generative-ai` npm package.
*   Instantiate the client with your API key (stored securely, e.g., in environment variables).
*   Specify the desired **Model ID** (e.g., `gemini-2.5-pro-preview-03-25`) when making API calls.

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  // For text-only input, use the gemini-2.5-pro-preview-03-25 model
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" }); // Or use the Flash ID

  const prompt = "Analyze this content for keywords and sentiment: [Your Content Here]";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();
```

*   Remember to handle potential errors and the preview status of the models.
