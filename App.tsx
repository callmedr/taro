import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TAROT_CARD_DEFINITIONS } from './constants';
import { getCardImageUrl } from './services/supabaseService';
import { TarotCardData } from './types';
import TarotCard from './components/TarotCard';
import LoadingSpinner from './components/LoadingSpinner';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

type GameState = 'question' | 'shuffling' | 'results';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('question');
  const [question, setQuestion] = useState('');
  const [deck, setDeck] = useState<TarotCardData[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCardData[]>([]);
  const [shufflingCard, setShufflingCard] = useState<TarotCardData | null>(null);
  const [animationCards, setAnimationCards] = useState<{ card: TarotCardData; style: React.CSSProperties }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [flyingCard, setFlyingCard] = useState<TarotCardData | null>(null);

  const shuffleIntervalRef = useRef<number | null>(null);

  const setupDeck = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const allCards = TAROT_CARD_DEFINITIONS.map((def, index) => ({
        id: index,
        name: def.name_ko,
        name_en: def.name_en,
        url: getCardImageUrl(index, def.name_en),
      }));
      setDeck(shuffleArray(allCards));
    } catch (err) {
      console.error("Error setting up deck:", err);
      setError("카드를 준비할 수 없습니다. 연결을 확인하고 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setupDeck();
  }, [setupDeck]);

  const startShuffling = useCallback(() => {
    if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);

    shuffleIntervalRef.current = window.setInterval(() => {
      if (deck.length > 0) {
        const shuffledSlice = shuffleArray(deck).slice(0, 5);
        const newAnimationCards = shuffledSlice.map((card, index) => {
          const rotation = Math.random() * 8 - 4;
          const offsetX = Math.random() * 8 - 4;
          const offsetY = Math.random() * 8 - 4;
          return {
            card,
            style: {
              transform: `rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px)`,
              zIndex: index,
              transition: 'transform 0.1s ease-out',
            },
          };
        });
        setAnimationCards(newAnimationCards);
        if (shuffledSlice.length > 0) {
          setShufflingCard(shuffledSlice[0]);
        }
      }
    }, 100);
  }, [deck]);

  useEffect(() => {
    if (gameState === 'shuffling' && selectedCards.length < 3 && !isAnimating) {
      startShuffling();
    } else {
      if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
    }
    return () => {
      if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
    };
  }, [gameState, selectedCards.length, startShuffling, isAnimating]);

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      setGameState('shuffling');
    }
  };

  const handleSelectCard = () => {
    if (shufflingCard && selectedCards.length < 3 && !isAnimating) {
      if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
      setIsAnimating(true);
      setFlyingCard(shufflingCard);
    }
  };

  const handleAnimationEnd = () => {
    if (flyingCard) {
      const newSelectedCards = [...selectedCards, flyingCard];
      setSelectedCards(newSelectedCards);
      setDeck(prevDeck => prevDeck.filter(card => card.id !== flyingCard.id));
      setFlyingCard(null);
      setIsAnimating(false);
      
      if (newSelectedCards.length === 3) {
        setGameState('results');
      }
    }
  };

  const handleReset = () => {
    setQuestion('');
    setSelectedCards([]);
    setGameState('question');
    setAnimationCards([]);
    setIsAnimating(false);
    setFlyingCard(null);
    setupDeck();
  };
  
  const getShufflePrompt = () => {
    if (isAnimating) return "카드를 배치하는 중...";
    switch (selectedCards.length) {
      case 0: return "첫 번째 카드를 위해 직감으로 '선택' 버튼을 눌러주세요.";
      case 1: return "두 번째 카드를 위해 직감으로 '선택' 버튼을 눌러주세요.";
      case 2: return "세 번째 카드를 위해 직감으로 '선택' 버튼을 눌러주세요.";
      default: return "";
    }
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner size="lg" className="my-24" />;
    if (error) return (
      <div className="text-center my-24 p-8 bg-red-900/20 border border-red-500/50 rounded-lg">
        <p className="text-red-400 text-xl">{error}</p>
        <button onClick={setupDeck} className="mt-6 px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-all">다시 시도</button>
      </div>
    );

    switch (gameState) {
      case 'question':
        return (
          <form onSubmit={handleQuestionSubmit} className="w-full max-w-lg flex flex-col items-center">
            <h2 className="text-2xl text-indigo-200 mb-4 text-center">어떤 질문을 가지고 계신가요?</h2>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="예: 저의 연애운은 어떨까요?"
              className="w-full h-32 p-4 bg-gray-800/50 border-2 border-purple-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button type="submit" disabled={!question.trim()} className="mt-6 px-8 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100">
              카드 섞기
            </button>
          </form>
        );
      case 'shuffling':
        return (
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full gap-8 md:gap-24">
            {/* Left Column */}
            <div className="flex flex-col items-center">
              <p className="text-xl text-indigo-200 mb-4 h-8 text-center">{getShufflePrompt()}</p>
              <div className="relative h-80 w-52 flex items-center justify-center">
                  {!isAnimating && animationCards.map(({ card, style }, index) => (
                      <div key={`${card.id}-${index}`} className="absolute">
                          <TarotCard
                              card={card}
                              isRevealed={false}
                              size="md"
                              style={style}
                          />
                      </div>
                  ))}
                  {flyingCard && (
                      <div className="absolute z-50">
                          <TarotCard
                              card={flyingCard}
                              isRevealed={false}
                              size="md"
                              animationClass={`animate-fly-slot-${selectedCards.length}`}
                              onAnimationEnd={handleAnimationEnd}
                          />
                      </div>
                  )}
              </div>
              <button onClick={handleSelectCard} disabled={isAnimating} className="mt-6 px-12 py-4 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100">
                  선택
              </button>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4 md:pt-16">
              {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="w-16 h-28 rounded-lg bg-indigo-900/50 border-2 border-dashed border-purple-400/30 flex items-center justify-center">
                      {selectedCards[index] && <TarotCard card={selectedCards[index]} isRevealed={true} size="sm" />}
                  </div>
              ))}
            </div>
          </div>
        );
      case 'results':
        return (
          <div className="flex flex-col items-center w-full">
            <div className="mb-8 text-center p-4 bg-black/20 rounded-lg max-w-2xl">
              <p className="text-indigo-200 text-lg">질문:</p>
              <p className="text-white text-xl font-semibold">{question}</p>
            </div>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start justify-center">
              {selectedCards.map((card) => (
                <div key={card.id} className="flex flex-col items-center">
                  <TarotCard card={card} isRevealed={true} size="lg" />
                </div>
              ))}
            </div>
            <button onClick={handleReset} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
              새로운 리딩 시작하기
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-black text-white font-sans p-4 sm:p-8 flex flex-col items-center">
      <header className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 tracking-wider">
          직관 타로 리딩
        </h1>
        {gameState !== 'question' && <p className="text-indigo-200 mt-2">당신의 직관이 이끄는대로 선택하세요.</p>}
      </header>
      
      <main className="w-full max-w-screen-xl flex flex-col items-center justify-center flex-grow">
          {renderContent()}
      </main>

      <footer className="text-center text-gray-500 mt-auto text-sm pt-8">
        <p>타로 리딩은 오락용으로만 즐겨주세요.</p>
      </footer>
    </div>
  );
};

export default App;