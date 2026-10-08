import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function rephraseWithGPT(text: string): Promise<string> {
  const response = await openai.responses.create({
    model: "gpt-6-luna",
    input: `Rephrase the following text naturally and clearly.

Return ONLY the rephrased text.
Do not explain anything.
Do not provide alternatives.

Text:
${text}`,
  });

  return response.output_text ?? "";
}
