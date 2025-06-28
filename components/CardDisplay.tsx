import React from 'react';
import { TarotCardInfo } from '../types';

interface CardDisplayProps {
  card: TarotCardInfo;
  position: string; // "과거", "현재", "미래"
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card, position }) => {
  return (
    <div className="bg-gray-800 p-3 md:p-4 rounded-lg shadow-xl text-center w-full sm:w-48 md:w-56 mx-auto my-2 transform hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-700 hover:border-purple-500">
      <h3 className="text-sm md:text-md font-semibold text-purple-400 mb-2">{position}</h3>
      <div className="aspect-[2/3] w-full overflow-hidden rounded">
        <img 
          src={card.imageUrl} 
          alt={card.koreanName} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
      </div>
      <p className="mt-2 text-md md:text-lg text-purple-200 truncate" title={card.koreanName}>{card.koreanName}</p>
    </div>
  );
};

export default CardDisplay;
