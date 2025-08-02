import { GoogleGenAI } from "@google/genai";
import crypto from 'crypto';
import { trackGeminiTokens } from "../functions/utils/geminiTokens";
import { redisClient } from "../database/schema/connections/Redis";

const ai = new GoogleGenAI({});

export async function mainGemini(prompt: string) {
  const cacheKey = `gemini:${crypto.createHash('sha256').update(prompt).digest('hex')}`;

  // Try to get from cache first
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log("Cache hit!");
    console.log("cached Data: ", cached);
    return JSON.parse(cached);
  }

  console.log("Cache miss. Calling Gemini API...");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ parts: [{ text: prompt }] }],
    });

    const { promptTokenCount, candidatesTokenCount, totalTokenCount } = response.usageMetadata!;
    trackGeminiHelper(totalTokenCount!);

    const responseText = response.text || '';
    let jsonString = '';

    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    } else {
      jsonString = responseText;
    }

    const parsedResponse = JSON.parse(jsonString);
    const { productName, customerName, action, quantity, discount } = parsedResponse;

    // ✅ Prepare result
    const result = {
      success: true,
      message: response.text,
      tokenUsage: { prompt: promptTokenCount, candidates: candidatesTokenCount, total: totalTokenCount },
      extractedData: { productName, customerName, action, quantity, discount }
    };
    console.log(result)

    // 🔁 Cache for 24 hours (86400 seconds)
    await redisClient.setEx(cacheKey, 86400, JSON.stringify(result));

    return result;
  } catch (error) {
    console.error("Error in mainGemini:", error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

const trackGeminiHelper = (tokensUsed: number) => {
  // Track token usage in gemini
  const usageReport = trackGeminiTokens(tokensUsed);

  console.log("Total tokens used: ", tokensUsed);
  console.log("TPM usage: ", usageReport.TPM);
  console.log("TPD usage: ", usageReport.TPD);
  console.log("RPM usage: ", usageReport.RPM);
  console.log("RPD usage: ", usageReport.RPD);
}