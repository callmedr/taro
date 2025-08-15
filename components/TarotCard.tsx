import React from 'react';
import { TarotCardData } from '../types';

interface TarotCardProps {
  card: TarotCardData;
  isRevealed: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  animationClass?: string;
  onAnimationEnd?: () => void;
}

const TarotCard: React.FC<TarotCardProps> = ({ card, isRevealed, isSelected = false, onClick, size = 'lg', style, animationClass, onAnimationEnd }) => {
  const sizeClasses = {
    sm: 'w-16 h-28',
    md: 'w-40 h-70',
    lg: 'w-[240px] h-[420px]',
  };

  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div 
        className={`cursor-pointer group transition-transform duration-300 ${isSelected ? '-translate-y-2' : ''} ${animationClass || ''}`}
        onClick={onClick}
        style={style}
        onAnimationEnd={onAnimationEnd}
    >
      <div className={`${sizeClasses[size]} [perspective:1000px]`}>
        <div
          className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isRevealed ? '[transform:rotateY(180deg)]' : ''} ${isSelected && !isRevealed ? 'ring-4 ring-purple-400 rounded-lg' : ''}`}
        >
          {/* Card Back */}
          <div className="absolute w-full h-full [backface-visibility:hidden] rounded-lg bg-indigo-900 border-2 border-purple-400/50 shadow-lg shadow-purple-900/50 flex items-center justify-center overflow-hidden">
            <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0)_60%)]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${iconSizeClasses[size]} text-purple-400 opacity-50`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 z"/>
              </svg>
          </div>
          {/* Card Front */}
          <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg overflow-hidden shadow-2xl shadow-purple-500/40">
            <img src={card.url} alt={card.name} className="w-full h-full object-cover" />
            <div className={`absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-center ${size === 'sm' || size === 'md' ? 'hidden' : ''}`}>
              <p className="text-white text-xs sm:text-sm font-semibold truncate">{card.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotCard;