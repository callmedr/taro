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

export const GENERIC_ERROR_MESSAGE = "해석을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
export const SUPABASE_FUNCTION_ERROR_MESSAGE = "AI 해석 기능(Supabase Edge Function)을 호출하는 중 오류가 발생했습니다. 이는 종종 Edge Function의 CORS(Cross-Origin Resource Sharing) 설정 문제로 인해 발생합니다. Supabase 대시보드에서 Edge Function 코드를 확인하여, 브라우저에서의 요청을 허용하도록 CORS 관련 헤더(예: 'Access-Control-Allow-Origin')를 올바르게 반환하고 있는지 확인해주세요.";

// Supabase
export const SUPABASE_URL = 'https://vkqvbsspsnohrplmyjap.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrcXZic3Nwc25vaHJwbG15amFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMTg5NTYsImV4cCI6MjA2NjU5NDk1Nn0.mUu-9d6xjhiM5CUJmPj-xMNiIlZaaQ2Fy4HO0mQtxpM';
export const SUPABASE_SAVE_ERROR_MESSAGE = "기록을 저장하는 중 오류가 발생했습니다. 네트워크 연결이나 Supabase 설정을 확인해주세요.";