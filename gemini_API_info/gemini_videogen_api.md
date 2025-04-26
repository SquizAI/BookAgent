Generate video using Veo

The Gemini API provides access to Veo 2, Google's most capable video generation model to date. Veo generates videos in a wide range of cinematic and visual styles, capturing prompt nuance to render intricate details consistently across frames. This guide will help you get started with Veo using the Gemini API.

For video prompting guidance, check out the Veo prompt guide section.

Note: Veo is a paid feature and will not run in the Free tier. Visit the Pricing page for more details.
Before you begin
Before calling the Gemini API, ensure you have your SDK of choice installed, and a Gemini API key configured and ready to use.

To use Veo with the Google Gen AI SDKs, ensure that you have one of the following versions installed:

Python v1.10.0 or later
TypeScript and JavaScript v0.8.0 or later
Go v1.0.0 or later
Generate videos
This section provides code examples for generating videos using text prompts and using images.

Generate from text
You can use the following code to generate videos with Veo:

Python
JavaScript
REST

import { GoogleGenAI } from "@google/genai";
import { createWriteStream } from "fs";
import { Readable } from "stream";

const ai = new GoogleGenAI({ apiKey: "GOOGLE_API_KEY" });

async function main() {
  let operation = await ai.models.generateVideos({
    model: "veo-2.0-generate-001",
    prompt: "Panning wide shot of a calico kitten sleeping in the sunshine",
    config: {
      personGeneration: "dont_allow",
      aspectRatio: "16:9",
    },
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({
      operation: operation,
    });
  }

  operation.response?.generatedVideos?.forEach(async (generatedVideo, n) => {
    const resp = await fetch(`${generatedVideo.video?.uri}&key=GOOGLE_API_KEY`); // append your API key
    const writer = createWriteStream(`video${n}.mp4`);
    Readable.fromWeb(resp.body).pipe(writer);
  });
}

main();
Kitten sleeping in the sun.

This code takes about 2-3 minutes to run, though it may take longer if resources are constrained. Once it's done running, you should see a video that looks something like this:

If you see an error message instead of a video, this means that resources are constrained and your request couldn't be completed. In this case, run the code again.

Generated videos are stored on the server for 2 days, after which they are removed. If you want to save a local copy of your generated video, you must run result() and save() within 2 days of generation.

Generate from images
You can also generate videos using images. The following code generates an image using Imagen, then uses the generated image as the starting frame for the generated video.

First, generate an image using Imagen:

Python
JavaScript

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "GOOGLE_API_KEY" });
const response = await ai.models.generateImages({
  model: "imagen-3.0-generate-002",
  prompt: "Panning wide shot of a calico kitten sleeping in the sunshine",
  config: {
    numberOfImages: 1,
  },
});

// you'll pass response.generatedImages[0].image.imageBytes to Veo
Then, generate a video using the resulting image as the first frame:

Python
JavaScript

import { GoogleGenAI } from "@google/genai";
import { createWriteStream } from "fs";
import { Readable } from "stream";

const ai = new GoogleGenAI({ apiKey: "GOOGLE_API_KEY" });

async function main() {
  // get image bytes from Imagen, as shown above

  let operation = await ai.models.generateVideos({
    model: "veo-2.0-generate-001",
    prompt: "Panning wide shot of a calico kitten sleeping in the sunshine",
    image: {
      imageBytes: response.generatedImages[0].image.imageBytes, // response from Imagen
      mimeType: "image/png",
    },
    config: {
      aspectRatio: "16:9",
      numberOfVideos: 2,
    },
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({
      operation: operation,
    });
  }

  operation.response?.generatedVideos?.forEach(async (generatedVideo, n) => {
    const resp = await fetch(
      `${generatedVideo.video?.uri}&key=GOOGLE_API_KEY`, // append your API key
    );
    const writer = createWriteStream(`video${n}.mp4`);
    Readable.fromWeb(resp.body).pipe(writer);
  });
}

main();
Veo model parameters
(Naming conventions vary by programming language.)

prompt: The text prompt for the video. When present, the image parameter is optional.
image: The image to use as the first frame for the video. When present, the prompt parameter is optional.
negativePrompt: Text string that describes anything you want to discourage the model from generating
aspectRatio: Changes the aspect ratio of the generated video. Supported values are "16:9" and "9:16". The default is "16:9".
personGeneration: Allow the model to generate videos of people. The following values are supported:
Text-to-video generation:
"dont_allow": Don't allow the inclusion of people or faces.
"allow_adult": Generate videos that include adults, but not children.
Image-to-video generation:
Not allowed; server will reject the request if parameter is used.
numberOfVideos: Output videos requested, either 1 or 2.
durationSeconds: Length of each output video in seconds, between 5 and 8.
enhance_prompt: Enable or disable the prompt rewriter. Enabled by default.
Specifications
Modalities	
Text-to-video generation
Image-to-video generation
Request latency	
Min: 11 seconds
Max: 6 minutes (during peak hours)
Variable length generation	5-8 seconds
Resolution	720p
Frame rate	24fps
Aspect ratio	
16:9 - landscape
9:16 - portrait
Input languages (text-to-video)	English