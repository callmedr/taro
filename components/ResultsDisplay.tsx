import React from 'react';
import { DrawnCards } from '../types';
import CardDisplay from './CardDisplay';

interface ResultsDisplayProps {
  drawnCards: DrawnCards | null;
  interpretation: string | null;
  isLoading: boolean;
  error: string | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ drawnCards, interpretation, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-md p-6 bg-gray-800 border border-gray-700 rounded-lg text-center">
        <svg className="animate-spin h-12 w-12 text-purple-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl text-purple-300">AI가 당신의 카드를 해석하고 있습니다...</p>
        <p className="text-gray-400">잠시만 기다려주세요.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl p-6 bg-red-900 border border-red-700 rounded-lg text-red-100">
        <h2 className="text-xl font-semibold mb-2">오류 발생</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!drawnCards || !interpretation) {
    return null; // Nothing to display yet, or initial state
  }

  return (
    <div className="w-full max-w-4xl p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-purple-400 mb-6 text-center">The whisper of Youngsoo</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-medium text-purple-300 mb-4 text-center">당신이 뽑은 카드</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <CardDisplay card={drawnCards.past} position="과거" />
          <CardDisplay card={drawnCards.present} position="현재" />
          <CardDisplay card={drawnCards.future} position="미래" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-medium text-purple-300 mb-3">해석 및 조언:</h3>
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700 text-gray-200 whitespace-pre-wrap leading-relaxed shadow-inner">
          {interpretation}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;