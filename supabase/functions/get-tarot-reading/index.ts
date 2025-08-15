import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "https://esm.sh/@google/genai";

// Add a type definition for the Deno global object to resolve TypeScript
// errors in environments where Deno types are not automatically recognized.
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const schema = {
  type: Type.OBJECT,
  properties: {
    past: {
      type: Type.STRING,
      description: "첫 번째 카드(과거)에 대한 해석입니다. 사용자의 질문과 관련지어 500자 내외로 상세하게 설명해주세요.",
    },
    present: {
      type: Type.STRING,
      description: "두 번째 카드(현재)에 대한 해석입니다. 사용자의 질문과 관련지어 500자 내외로 상세하게 설명해주세요.",
    },
    future: {
      type: Type.STRING,
      description: "세 번째 카드(미래)에 대한 해석입니다. 사용자의 질문과 관련지어 500자 내외로 상세하게 설명해주세요.",
    },
    summary: {
      type: Type.STRING,
      description: "세 장의 카드를 종합하여 질문에 대한 총운 및 조언을 800자 내외로 제공해주세요. 긍정적이고 희망적인 관점에서 조언해주세요.",
    },
  },
  required: ['past', 'present', 'future', 'summary'],
};

serve(async (req) => {
  // CORS preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 환경 변수에서 API 키 가져오기 (GEMINI_API_KEY로 변경)
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY environment variable not set.");
      // 키가 없을 경우 명확한 오류 응답 반환
      return new Response(JSON.stringify({ error: '서버 설정 오류: API 키가 누락되었습니다.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    // 요청 핸들러 내에서 AI 클라이언트 초기화
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // 요청 본문 가져오기
    const { question, cards } = await req.json();

    if (!question || !cards || !Array.isArray(cards) || cards.length !== 3) {
      return new Response(JSON.stringify({ error: '질문과 3장의 카드를 모두 포함해야 합니다.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // 프롬프트 구성
    const prompt = `질문: "${question}"\n\n뽑은 카드:\n1. 과거: ${cards[0].name}\n2. 현재: ${cards[1].name}\n3. 미래: ${cards[2].name}`;
    
    // Gemini API 호출
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "당신은 지혜롭고 공감 능력이 뛰어난 타로 마스터입니다. 사용자의 질문과 3장의 카드를 기반으로 상세하고 따뜻한 조언을 한국어로 제공해주세요. 각 카드는 각각 과거, 현재, 미래를 상징합니다. 마지막으로 전체적인 조언을 요약해주세요. 모든 답변은 매우 친절하고 상세해야 합니다.",
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
        topP: 0.95,
      }
    });

    // 응답에서 JSON 문자열 구문 분석
    const interpretationText = response.text.trim();
    if (!interpretationText.startsWith('{') && !interpretationText.startsWith('[')) {
        console.error('Gemini did not return valid JSON:', interpretationText);
        throw new Error('AI가 유효한 형식의 답변을 생성하지 못했습니다.');
    }
    const interpretation = JSON.parse(interpretationText);

    // 성공적인 응답 반환
    return new Response(JSON.stringify(interpretation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing tarot reading:', error);
    // 일반적인 오류 반환
    return new Response(JSON.stringify({ error: '타로 리딩을 생성하는 중 오류가 발생했습니다.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});