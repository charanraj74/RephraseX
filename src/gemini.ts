import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function rephraseText(text: string): Promise<string> {
    const response = await ai.interactions.create({
        model: "gemini-3.8-flash",
        input: `Rephrase the following text naturally and clearly. Return only the rephrased text, with no explanations or alternatives.

Text:
${text}`,
    });

    return response.output_text ?? "";
}