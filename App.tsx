import React, { useState, useCallback, useEffect } from 'react';
import QuestionForm from './components/QuestionForm';
import ResultsDisplay from './components/ResultsDisplay';
import ApiKeyInput from './components/ApiKeyInput';
import { drawThreeCards, getTarotInterpretation, isApiKeyAvailable, setApiKey } from './services/geminiService';
import { saveReading } from './services/supabaseService';
import { DrawnCards } from './types';
import { 
  API_KEY_ERROR_MESSAGE, 
  GENERIC_ERROR_MESSAGE, 
  ENTER_API_KEY_PROMPT,
  SUPABASE_SAVE_ERROR_MESSAGE
} from './constants';

const App: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [drawnCards, setDrawnCards] = useState<DrawnCards | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);
  
  // Check for Gemini key on initial load
  useEffect(() => {
    setApiKeyMissing(!isApiKeyAvailable());
  }, []);

  const handleApiKeySubmit = (apiKey: string) => {
    setApiKey(apiKey);
    setApiKeyMissing(false);
    setError(null);
  };

  const handleGetInterpretation = useCallback(async (currentQuestion: string) => {
    if (!isApiKeyAvailable()) {
      setError(API_KEY_ERROR_MESSAGE);
      setApiKeyMissing(true);
      return;
    }

    setQuestion(currentQuestion);
    setIsLoading(true);
    setError(null);
    setInterpretation(null);
    
    const cards = drawThreeCards();
    setDrawnCards(cards);

    try {
      const aiInterpretation = await getTarotInterpretation(currentQuestion, cards);
      setInterpretation(aiInterpretation);

      // Save the successful reading to Supabase in the background
      try {
        await saveReading(currentQuestion, cards, aiInterpretation);
      } catch (saveError) {
        console.error("Failed to save reading:", saveError);
        // Don't block the user, just show a non-critical error or log it
        setError(SUPABASE_SAVE_ERROR_MESSAGE); 
      }

    } catch (e: any) {
      console.error("Interpretation error:", e);
      if (e.message === "API_KEY_MISSING" || e.message === "API_KEY_INVALID") {
        setError(API_KEY_ERROR_MESSAGE);
        setApiKeyMissing(true);
        setDrawnCards(null);
      } else {
        setError(GENERIC_ERROR_MESSAGE);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderContent = () => {
    if (apiKeyMissing) {
      return <ApiKeyInput
        onApiKeySubmit={handleApiKeySubmit}
        error={error}
        title="Gemini API 키 필요"
        promptText={ENTER_API_KEY_PROMPT}
        placeholder="Gemini API 키를 여기에 붙여넣으세요"
        linkUrl="https://aistudio.google.com/app/apikey"
        linkText="Google AI Studio에서 키 받기"
      />;
    }

    return (
      <>
        <QuestionForm onSubmit={handleGetInterpretation} isLoading={isLoading && !interpretation} />
        <ResultsDisplay
          drawnCards={drawnCards}
          interpretation={interpretation}
          isLoading={isLoading && !interpretation}
          error={error}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white p-4 flex flex-col items-center selection:bg-purple-500 selection:text-white">
      <header className="my-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 pb-3 mb-4">
          Whispers with Youngsoo
        </h1>
        <p className="text-md md:text-lg text-purple-200">
          당신의 질문에 대한 우주의 메시지를 전달해 드립니다.
        </p>
      </header>

      <main className="w-full flex flex-col items-center flex-grow max-w-4xl px-4">
        {renderContent()}
      </main>

      <footer className="mt-auto pt-8 pb-4 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Tarot Reader. 모든 해석은 오락 및 참고용입니다.</p>
        <p>Youngsoo whisper를 활용하여 생성되었습니다.</p>
      </footer>
    </div>
  );
};

export default App;