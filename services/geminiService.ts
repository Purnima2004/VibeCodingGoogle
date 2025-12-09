import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { GeminiResponse, SimulationStage } from '../types';

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client && process.env.API_KEY) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

// Cache responses to save tokens/latency
const responseCache: Record<number, GeminiResponse> = {};

export const fetchStageDetails = async (stageId: SimulationStage, stageTitle: string): Promise<GeminiResponse> => {
  if (responseCache[stageId]) {
    return responseCache[stageId];
  }

  const ai = getClient();
  if (!ai) {
    // Fallback if no API key is present
    return {
      explanation: "API Key missing. Please provide a valid API key to see real-time physiological data generation.",
      keyMolecules: ["N/A"],
      systemInteractions: ["Simulation running in offline mode"]
    };
  }

  try {
    const prompt = `Explain stage: ${stageTitle}.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text) as GeminiResponse;
    responseCache[stageId] = data;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      explanation: "Failed to load physiological data. Please check your connection.",
      keyMolecules: ["Error"],
      systemInteractions: ["Error retrieving data"]
    };
  }
};
