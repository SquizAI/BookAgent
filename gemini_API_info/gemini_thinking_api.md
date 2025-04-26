Gemini thinking

The Gemini 2.5 series models use an internal "thinking process" during response generation. This process contributes to their improved reasoning capabilities and helps them use multi-step planning to solve complex tasks. This makes these models especially good at coding, advanced mathematics, data analysis, and other tasks that require planning or thinking.

Try Gemini 2.5 Flash Preview in Google AI Studio
This guide shows you how to work with Gemini's thinking capabilities using the Gemini API.

For guidance on prompting thinking models, check out the Thinking prompt guide section.

Use thinking models
Models with thinking capabilities are available in Google AI Studio and through the Gemini API. Thinking is on by default in both the API and AI Studio because the 2.5 series models have the ability to automatically decide when and how much to think based on the prompt. For most use cases, it's beneficial to leave thinking on. But if you want to to turn thinking off, you can do so by setting the thinkingBudget parameter to 0.

Send a basic request
Python
JavaScript
Go
REST

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "GOOGLE_API_KEY" });

async function main() {
  const prompt = "Explain the concept of Occam's Razor and provide a simple, everyday example.";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: prompt,
  });

  console.log(response.text);
}

main();
Set budget on thinking models
The thinkingBudget parameter gives the model guidance on the number of thinking tokens it can use when generating a response. A greater number of tokens is typically associated with more detailed thinking, which is needed for solving more complex tasks. thinkingBudget must be an integer in the range 0 to 24576. Setting the thinking budget to 0 disables thinking.

Depending on the prompt, the model might overflow or underflow the token budget.

Python
JavaScript
REST

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "GOOGLE_API_KEY" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: "Explain the Occam's Razor concept and provide everyday examples of it",
    config: {
      thinkingConfig: {
        thinkingBudget: 1024,
      },
    },
  });

  console.log(response.text);
}

main();
Use tools with thinking models
Thinking models can use tools to perform actions beyond generating text. This allows them to interact with external systems, execute code, or access real-time information, incorporating the results into their reasoning and final response.

Search Tool
The Search tool allows the model to query external search engines to find up-to-date information or information beyond its training data. This is useful for questions about recent events or highly specific topics.

To configure the search tool, see Configure the Search tool.

Prompt:
What were the major scientific breakthroughs announced last week?
Response (using Search Tool):
Based on recent search results, here are some highlights from the past week in science:

...
Code Execution
The Code execution tool enables the model to generate and run Python code to perform calculations, manipulate data, or solve problems that are best handled algorithmically. The model receives the code's output and can use it in its response.

To configure code execution, see Enable code execution on the model.

Prompt:
What is the sum of the first 50 prime numbers?
Generate and run Python code for the calculation, and make sure you get all 50.
Provide the final sum clearly.
Response (using Code Execution Tool):
Okay, I can calculate that. I will generate Python code to find the first 50 prime numbers and sum them up.

```python
def is_prime(num):
    if num < 2:
        return False
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            return False
    return True

primes = []
num = 2
while len(primes) < 50:
    if is_prime(num):
        primes.append(num)
    num += 1

total_sum = sum(primes)
print(total_sum)
```

Running the code...

Code Execution Result:
Outcome: OK
Output:

5117
Use code with caution.
The sum of the first 50 prime numbers is 5117.
Thinking with structured output
With structured output, you can constrain Gemini to respond with JSON, a structured output format suitable for automated processing. This is particularly useful for integrating the model's output into applications.

You can specify the format directly in the prompt or supply a schema through model configuration.

Prompt:
Provide a list of 3 famous physicists and their key contributions
in JSON format.
Use this JSON schema:

Physicist = {'name': str, 'contribution': str, 'era': str}
Return: list[Physicist]
Response (instructed for JSON):
```json
[
{
"name": "Albert Einstein",
"contribution": "Theory of Relativity (Special and General)",
"era": "Early 20th Century"
},
{
"name": "Isaac Newton",
"contribution": "Laws of Motion and Universal Gravitation",
"era": "Late 17th / Early 18th Century"
},
{
"name": "Marie Curie",
"contribution": "Pioneering research on radioactivity",
"era": "Late 19th / Early 20th Century"
}
]
```
Thinking models prompt guide
Effective prompting is crucial for maximizing the benefits of the Gemini thinking models. This section outlines some prompting practices for thinking models.

