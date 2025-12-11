import { GoogleGenAI } from "@google/genai";
import { SOPB, JournalEntry } from "../types";

// Helper to initialize the client safely
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const auditSystemState = async (sopbs: SOPB[], journals: JournalEntry[]) => {
  try {
    const ai = getClient();
    
    const systemState = {
      orders: sopbs,
      journals: journals,
      timestamp: new Date().toISOString()
    };

    const prompt = `
      You are an expert Auditor and System Analyst for a Credit Purchase System.
      Analyze the following JSON state of the system including Purchase Orders (SOPB) and Accounting Journals.
      
      Rules for analysis:
      1. Check if "Paid" orders have a corresponding Journal Entry.
      2. Identify any orders stuck in "Submitted" or "Shipped" for too long (assume current date is 2024).
      3. Summarize the total pending debt (Invoiced but not Paid).
      4. Provide a brief, professional summary of the financial health based on these transactions.

      Here is the system data:
      ${JSON.stringify(systemState, null, 2)}
      
      Return the response in Markdown format. Keep it concise.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Audit Error:", error);
    return "Error performing AI audit. Please ensure API Key is valid.";
  }
};