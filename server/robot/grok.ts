
import Groq from "groq-sdk";
import { trackGroqTokens } from "../functions/utils/groqToken";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main(prompt: string) {
  const completion = await groq.chat.completions
    .create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "qwen/qwen3-32b",
    })
    .then((chatCompletion) => {
            const tokensUsed = chatCompletion.usage?.total_tokens || 0;

      // Track token usage in groq
      const usageReport = trackGroqTokens(tokensUsed);

      console.log(chatCompletion.choices[0]?.message?.content || "");
      console.log("Total tokens used: ", tokensUsed);
      console.log("TPM usage: ", usageReport.TPM);
      console.log("TPD usage: ", usageReport.TPD);
      console.log("RPM usage: ", usageReport.RPM);
      console.log("RPD usage: ", usageReport.RPD);
      return {
        success: true,
        message: chatCompletion.choices[0]?.message?.content || "",
      }
    });
}

