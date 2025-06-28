import { TarotCardSeed } from './types';

export const MAJOR_ARCANA_SEED: TarotCardSeed[] = [
  { id: 0, name: "The Fool", koreanName: "바보" },
  { id: 1, name: "The Magician", koreanName: "마법사" },
  { id: 2, name: "The High Priestess", koreanName: "여사제" },
  { id: 3, name: "The Empress", koreanName: "여황제" },
  { id: 4, name: "The Emperor", koreanName: "황제" },
  { id: 5, name: "The Hierophant", koreanName: "교황" },
  { id: 6, name: "The Lovers", koreanName: "연인" },
  { id: 7, name: "The Chariot", koreanName: "전차" },
  { id: 8, name: "Strength", koreanName: "힘" },
  { id: 9, name: "The Hermit", koreanName: "은둔자" },
  { id: 10, name: "Wheel of Fortune", koreanName: "운명의 수레바퀴" },
  { id: 11, name: "Justice", koreanName: "정의" },
  { id: 12, name: "The Hanged Man", koreanName: "매달린 남자" },
  { id: 13, name: "Death", koreanName: "죽음" },
  { id: 14, name: "Temperance", koreanName: "절제" },
  { id: 15, name: "The Devil", koreanName: "악마" },
  { id: 16, name: "The Tower", koreanName: "탑" },
  { id: 17, name: "The Star", koreanName: "별" },
  { id: 18, name: "The Moon", koreanName: "달" },
  { id: 19, name: "The Sun", koreanName: "태양" },
  { id: 20, name: "Judgement", koreanName: "심판" },
  { id: 21, name: "The World", koreanName: "세계" }
];

// Gemini API
export const API_KEY_ERROR_MESSAGE = "제공된 Gemini API 키가 유효하지 않거나 만료되었습니다. 다시 확인하고 새 키를 입력해주세요.";
export const ENTER_API_KEY_PROMPT = "계속하려면 Gemini API 키를 입력하세요. 키는 현재 브라우저 세션에만 저장됩니다.";
export const GENERIC_ERROR_MESSAGE = "해석을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

// Supabase
export const SUPABASE_URL = 'https://vkqvbsspsnohrplmyjap.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrcXZic3Nwc25vaHJwbG15amFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMTg5NTYsImV4cCI6MjA2NjU5NDk1Nn0.mUu-9d6xjhiM5CUJmPj-xMNiIlZaaQ2Fy4HO0mQtxpM';
export const SUPABASE_SAVE_ERROR_MESSAGE = "기록을 저장하는 중 오류가 발생했습니다. 네트워크 연결이나 Supabase 설정을 확인해주세요.";


export const SYSTEM_INSTRUCTION = `당신은 숙련된 타로 마스터입니다.
사용자가 선택한 3장의 타로 카드를 바탕으로, 사용자의 질문에 대해 직관적이고 통찰력 있는 답변을 제공하세요.
단순히 카드를 설명하지 말고, 질문의 맥락과 감정을 고려하여 카드와 질문을 연결해 해석하세요.`;

export const USER_PROMPT_TEMPLATE = (question: string, pastCard: string, presentCard: string, futureCard: string): string => `
사용자의 질문: "${question}"

뽑힌 카드:
과거: ${pastCard}
현재: ${presentCard}
미래: ${futureCard}

해석 지침:
- 사용자의 질문을 먼저 이해하고, 감정적인 뉘앙스를 고려하세요.
- 각 카드의 위치(과거, 현재, 미래)에 맞는 의미를 적용하세요.
- 질문에 대해 구체적이고 현실적인 조언을 해주세요.
- 마지막에는 따뜻하고 희망적으로 앞으로 나아갈 방향을 덧붙이세요.
`;