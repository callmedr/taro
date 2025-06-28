import { DrawnCards, TarotCardInfo, TarotCardSeed } from '../types';
import { 
  MAJOR_ARCANA_SEED, 
} from '../constants';
import { TAROT_CARD_IMAGE_URLS } from "../data/card-images";
import { invokeTarotInterpreter } from './supabaseService';

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
  try {
    // The call is now delegated to the Supabase Edge Function
    const interpretation = await invokeTarotInterpreter(question, cards);
    return interpretation;
  } catch (error) {
    console.error("Error getting interpretation from edge function:", error);
    // Propagate a generic error message to be handled by the UI
    throw new Error("INTERPRETATION_SERVICE_ERROR");
  }
};
