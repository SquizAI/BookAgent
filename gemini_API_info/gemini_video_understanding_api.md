Video understanding

Gemini models can process videos, enabling many frontier developer use cases that would have historically required domain specific models. Some of Gemini's vision capabilities include the ability to:

Describe, segment, and extract information from videos up to 90 minutes long
Answer questions about video content
Refer to specific timestamps within a video
Gemini was built to be multimodal from the ground up and we continue to push the frontier of what is possible. This guide shows how to use the Gemini API to generate text responses based on video inputs.

Before you begin
Before calling the Gemini API, ensure you have your SDK of choice installed, and a Gemini API key configured and ready to use.

Video input
You can provide videos as input to Gemini in the following ways:

Upload a video file using the File API before making a request to generateContent. Use this method for files larger than 20MB, videos longer than approximately 1 minute, or when you want to reuse the file across multiple requests.
Pass inline video data with the request to generateContent. Use this method for smaller files (<20MB) and shorter durations.
Include a YouTube URL directly in the prompt.
Upload a video file
You can use the Files API to upload a video file. Always use the Files API when the total request size (including the file, text prompt, system instructions, etc.) is larger than 20 MB, the video duration is significant, or if you intend to use the same video in multiple prompts.

The File API accepts video file formats directly. This example uses the short NASA film "Jupiter's Great Red Spot Shrinks and Grows". Credit: Goddard Space Flight Center (GSFC)/David Ladd (2018).

"Jupiter's Great Red Spot Shrinks and Grows" is in the public domain and does not show identifiable people. (NASA image and media usage guidelines.)

The following code downloads the sample video, uploads it using the File API, waits for it to be processed, and then uses the file reference in a generateContent request.

Python
JavaScript
Go
REST

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "GOOGLE_API_KEY" });

async function main() {
  const myfile = await ai.files.upload({
    file: "path/to/sample.mp4",
    config: { mimeType: "video/mp4" },
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: createUserContent([
      createPartFromUri(myfile.uri, myfile.mimeType),
      "Summarize this video. Then create a quiz with an answer key based on the information in this video.",
    ]),
  });
  console.log(response.text);
}

await main();
To learn more about working with media files, see Files API.

Pass video data inline
Instead of uploading a video file using the File API, you can pass smaller videos directly in the request to generateContent. This is suitable for shorter videos under 20MB total request size.

Here's an example of providing inline video data:

Python
JavaScript
REST

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const ai = new GoogleGenAI({ apiKey: "GOOGLE_API_KEY" });
const base64VideoFile = fs.readFileSync("path/to/small-sample.mp4", {
  encoding: "base64",
});

const contents = [
  {
    inlineData: {
      mimeType: "video/mp4",
      data: base64VideoFile,
    },
  },
  { text: "Please summarize the video in 3 sentences." }
];

const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: contents,
});
console.log(response.text);
Include a YouTube URL
Preview: The YouTube URL feature is in preview and is available at no charge. Pricing and rate limits are likely to change.
The Gemini API and AI Studio support YouTube URLs as a file data Part. You can include a YouTube URL with a prompt asking the model to summarize, translate, or otherwise interact with the video content.

Limitations:

You can't upload more than 8 hours of YouTube video per day.
You can upload only 1 video per request.
You can only upload public videos (not private or unlisted videos).
The following example shows how to include a YouTube URL with a prompt:

Python
JavaScript
Go
REST

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const result = await model.generateContent([
  "Please summarize the video in 3 sentences.",
  {
    fileData: {
      fileUri: "https://www.youtube.com/watch?v=9hE5-98ZeCg",
    },
  },
]);
console.log(result.response.text());
Refer to timestamps in the content
You can ask questions about specific points in time within the video using timestamps of the form MM:SS.

Python
JavaScript
Go
REST

const prompt = "What are the examples given at 00:05 and 00:10 supposed to show us?";
Transcribe video and provide visual descriptions
The Gemini models can transcribe and provide visual descriptions of video content by processing both the audio track and visual frames. For visual descriptions, the model samples the video at a rate of 1 frame per second. This sampling rate may affect the level of detail in the descriptions, particularly for videos with rapidly changing visuals.

Python
JavaScript
Go
REST

const prompt = "Transcribe the audio from this video, giving timestamps for salient events in the video. Also provide visual descriptions.";
Supported video formats
Gemini supports the following video format MIME types:

video/mp4
video/mpeg
video/mov
video/avi
video/x-flv
video/mpg
video/webm
video/wmv
video/3gpp
Technical details about videos
Supported models & context: All Gemini 2.0 and 2.5 models can process video data.
Models with a 2M context window can process videos up to 2 hours long, while models with a 1M context window can process videos up to 1 hour long.
File API processing: When using the File API, videos are sampled at 1 frame per second (FPS) and audio is processed at 1Kbps (single channel). Timestamps are added every second.
These rates are subject to change in the future for improvements in inference.
Token calculation: Each second of video is tokenized as follows:
Individual frames (sampled at 1 FPS): 258 tokens per frame.
Audio: 32 tokens per second.
Metadata is also included.
Total: Approximately 300 tokens per second of video.
Timestamp format: When referring to specific moments in a video within your prompt, use the MM:SS format (e.g., 01:15 for 1 minute and 15 seconds).
Best practices:
Use only one video per prompt request for optimal results.
If combining text and a single video, place the text prompt after the video part in the contents array.
Be aware that fast action sequences might lose detail due to the 1 FPS sampling rate. Consider slowing down such clips if necessary.