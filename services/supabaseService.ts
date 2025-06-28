import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';
import { DrawnCards, Reading } from '../types';

let supabase: SupabaseClient | null = null;

const getClient = (): SupabaseClient => {
  if (supabase) {
    return supabase;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase URL or Anon Key is not configured in constants.ts");
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabase;
};

/**
 * Invokes the 'ai-interpretation' edge function to get an interpretation.
 */
export const invokeTarotInterpreter = async (
  question: string,
  cards: DrawnCards
): Promise<string> => {
  const client = getClient();
  const { data, error } = await client.functions.invoke('ai-interpretation', {
    body: {
      question: question,
      pastCardName: cards.past.koreanName,
      presentCardName: cards.present.koreanName,
      futureCardName: cards.future.koreanName,
    },
  });

  if (error) {
    console.error('Error invoking Supabase function:', error);
    // This custom error message is caught in App.tsx to provide specific feedback.
    throw new Error('INTERPRETATION_SERVICE_ERROR');
  }

  // Edge function should return { interpretation: "text" }
  if (data && typeof data.interpretation === 'string') {
    return data.interpretation;
  } else {
    console.error('Invalid or missing interpretation in function response:', data);
    throw new Error('INVALID_FUNCTION_RESPONSE');
  }
};


/**
 * Saves a single tarot reading to the database.
 * Returns the saved record.
 */
export const saveReading = async (
  question: string,
  cards: DrawnCards,
  interpretation: string
): Promise<Reading | null> => {
  const client = getClient();

  const readingData = {
    question,
    interpretation,
    past_card_name: cards.past.koreanName,
    present_card_name: cards.present.koreanName,
    future_card_name: cards.future.koreanName,
    past_card_image_url: cards.past.imageUrl,
    present_card_image_url: cards.present.imageUrl,
    future_card_image_url: cards.future.imageUrl,
  };

  const { data, error } = await client
    .from('readings')
    .insert([readingData])
    .select()
    .single();

  if (error) {
    console.error("Error saving reading:", error.message || JSON.stringify(error));
    // Note: If you see a 'permission denied' error, you likely need to set up
    // Row Level Security (RLS) policies for your 'readings' table in the Supabase dashboard.
    // A simple policy for public insert access would be: 'FOR INSERT WITH CHECK (true)'
    throw new Error("SUPABASE_SAVE_ERROR");
  }

  return data;
};