

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DrawnCards, TarotCardInfo, TarotCardSeed } from '../types';
import { 
  MAJOR_ARCANA_SEED, 
  SYSTEM_INSTRUCTION, 
  USER_PROMPT_TEMPLATE, 
  GEMINI_MODEL_NAME
} from '../constants';
import { TAROT_CARD_IMAGE_URLS } from "../data/card-images";

let ai: GoogleGenAI | null = null;
const API_KEY_SESSION_STORAGE_KEY = 'gemini_api_key';


const getApiKey = (): string | null => {
  // Try to get from sessionStorage first (for client-side user input)
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const key = window.sessionStorage.getItem(API_KEY_SESSION_STORAGE_KEY);
    if (key) return key;
  }
  // Fallback to process.env (for build-time/server-side scenarios)
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    // @ts-ignore
    return process.env.API_KEY;
  }
  return null;
};

export const setApiKey = (key: string): void => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.setItem(API_KEY_SESSION_STORAGE_KEY, key);
    // After setting a new key, the AI instance needs to be re-initialized.
    // Setting ai to null will force re-initialization on the next call.
    ai = null;
  }
};

const initializeAi = (): GoogleGenAI | null => {
  if (ai) return ai;
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("API Key is missing. User needs to provide one.");
    return null;
  }
  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    return null;
  }
};

export const drawThreeCards = (): DrawnCards => {
  const shuffledSeeds = [...MAJOR_ARCANA_SEED].sort(() => 0.5 - Math.random());
  const selectedSeeds: TarotCardSeed[] = shuffledSeeds.slice(0, 3);

  const cardsWithImages: TarotCardInfo[] = selectedSeeds.map((seed) => ({
    ...seed,
    imageUrl: TAROT_CARD_IMAGE_URLS[seed.name] || '', // Fallback to empty string if not found
  }));
  
  return {
    past: cardsWithImages[0],
    present: cardsWithImages[1],
    future: cardsWithImages[2],
  };
};

export const getTarotInterpretation = async (
  question: string,
  cards: DrawnCards
): Promise<string> => {
  const currentAiInstance = initializeAi();
  if (!currentAiInstance) {
    throw new Error("API_KEY_MISSING");
  }

  const promptContent = USER_PROMPT_TEMPLATE(question, cards.past.koreanName, cards.present.koreanName, cards.future.koreanName);

  try {
    const response: GenerateContentResponse = await currentAiInstance.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: "user", parts: [{text: promptContent}] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, 
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for text interpretation:", error);
    if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("API key is invalid"))) {
        throw new Error("API_KEY_INVALID");
    }
    throw new Error("GEMINI_API_ERROR");
  }
};

export const isApiKeyAvailable = (): boolean => {
    return !!getApiKey();
};
