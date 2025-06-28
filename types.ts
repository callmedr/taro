export interface TarotCardSeed {
  id: number;
  name: string; // English name
  koreanName: string;
}

export interface TarotCardInfo extends TarotCardSeed {
  imageUrl: string;
  keywords?: string[]; // Optional: for more detailed card info, not used in this version's AI prompt
}

export interface DrawnCards {
  past: TarotCardInfo;
  present: TarotCardInfo;
  future: TarotCardInfo;
}

// For grounding metadata if Google Search is used (not in this version, but good to have)
export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // other types of grounding chunks can be added here
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // other grounding metadata fields
}

// Represents a single tarot reading record saved in the database
export interface Reading {
  id: number;
  created_at: string;
  question: string;
  interpretation: string;
  past_card_name: string;
  present_card_name: string;
  future_card_name: string;
  past_card_image_url: string;
  present_card_image_url: string;
  future_card_image_url: string;
}