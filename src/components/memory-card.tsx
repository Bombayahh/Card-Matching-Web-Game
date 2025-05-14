'use client';

import type { CardType } from '@/types';
import { Card as ShadcnCard } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Shapes } from 'lucide-react'; // Default icon for card back

interface MemoryCardProps {
  card: CardType;
  onCardClick: (id: string) => void;
  disabled: boolean; // Generally disabled during checks or if already matched
}

export function MemoryCard({ card, onCardClick, disabled }: MemoryCardProps) {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onCardClick(card.id);
    }
  };

  const Icon = card.IconComponent;

  return (
    <ShadcnCard
      className={cn(
        'aspect-square cursor-pointer perspective card-container',
        card.isFlipped && 'card-flipped',
        card.isMatched && 'card-matched',
      )}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick();}}
      tabIndex={disabled || card.isFlipped || card.isMatched ? -1 : 0}
      role="button"
      aria-pressed={card.isFlipped}
      aria-label={`Card ${card.iconName}${card.isMatched ? ' - Matched' : ''}${card.isFlipped ? ' - Flipped' : ''}`}
      data-disabled={disabled || card.isMatched}
      data-matched={card.isMatched}
    >
      <div className="card-inner">
        <div className="card-face card-front">
          {/* Content for the front of the card (visible initially, card back) */}
          <Shapes size={48} strokeWidth={1.5} />
        </div>
        <div className="card-face card-back">
          {/* Content for the back of the card (visible after flip, card face) */}
          <Icon size={48} strokeWidth={1.5} />
        </div>
      </div>
    </ShadcnCard>
  );
}
