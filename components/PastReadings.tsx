import React from 'react';
import { Reading } from '../types';
import CardDisplay from './CardDisplay';

interface PastReadingsProps {
  readings: Reading[];
  isLoading: boolean;
}

const PastReadings: React.FC<PastReadingsProps> = ({ readings, isLoading }) => {
  if (isLoading) {
    return (
        <div className="w-full mt-12 text-center">
            <p className="text-purple-300">이전 기록을 불러오는 중...</p>
        </div>
    )
  }
  
  if (readings.length === 0) {
    return (
        <div className="w-full mt-12 text-center">
            <p className="text-gray-400">아직 저장된 기록이 없습니다.</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mt-12">
      <h2 className="text-2xl font-semibold text-purple-400 mb-6 text-center">최근 기록</h2>
      <div className="space-y-4">
        {readings.map((reading) => (
          <details key={reading.id} className="bg-gray-800/50 rounded-lg border border-gray-700 open:border-purple-500 transition-colors">
            <summary className="p-4 cursor-pointer flex justify-between items-center text-purple-300 hover:bg-gray-800/80 rounded-t-lg">
              <span className="font-medium truncate pr-4">{reading.question}</span>
              <span className="text-sm text-gray-400 flex-shrink-0">
                {new Date(reading.created_at).toLocaleDateString('ko-KR')}
              </span>
            </summary>
            <div className="p-4 md:p-6 border-t border-gray-700">
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-purple-300 mb-4 text-center">뽑았던 카드</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                        <CardDisplay card={{ id: 0, name: '', koreanName: reading.past_card_name, imageUrl: reading.past_card_image_url }} position="과거" />
                        <CardDisplay card={{ id: 1, name: '', koreanName: reading.present_card_name, imageUrl: reading.present_card_image_url }} position="현재" />
                        <CardDisplay card={{ id: 2, name: '', koreanName: reading.future_card_name, imageUrl: reading.future_card_image_url }} position="미래" />
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-medium text-purple-300 mb-3">The whisper of Youngsoo:</h3>
                    <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700 text-gray-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                        {reading.interpretation}
                    </div>
                </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default PastReadings;