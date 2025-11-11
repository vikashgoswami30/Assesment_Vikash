import dotenv from "dotenv";
dotenv.config(); 

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

const summarizeWithLLM = async (content) => {
  if (!content || !content.trim()) {
    throw new Error("No content provided for summarization.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You summarize text clearly and concisely." },
        { role: "user", content: `Summarize this:\n\n${content}` },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("Error generating summary:", err);
    throw new Error("Failed to generate summary.");
  }
};

export default summarizeWithLLM;
