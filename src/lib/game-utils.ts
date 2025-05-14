import type { CardType } from '@/types';
import { gameIconsList } from '@/components/icons';
import { HelpCircle } from 'lucide-react'; // Default icon if not enough unique icons

// Shuffle array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generateCardSet(numPairs: number): CardType[] {
  if (numPairs > gameIconsList.length) {
    console.warn(`Requested ${numPairs} pairs, but only ${gameIconsList.length} unique icons available. Some cards might have default icons or duplicates if not handled.`);
  }

  const selectedIcons = shuffleArray(gameIconsList).slice(0, numPairs);
  
  const cards: CardType[] = [];
  selectedIcons.forEach((iconInfo, index) => {
    const pairId = `pair-${index}`;
    const IconComponent = iconInfo.component || HelpCircle; 
    const iconName = iconInfo.name || `unknown-${index}`;

    cards.push({
      id: `${pairId}-a`,
      pairId,
      iconName,
      IconComponent,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: `${pairId}-b`,
      pairId,
      iconName,
      IconComponent,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffleArray(cards);
}

export const getGridColsClass = (numCards: number): string => {
  // numPairs options: 4,  6,  8,  10, 12, 15, 18
  // numCards:       8, 12, 16, 20, 24, 30, 36
  if (numCards <= 8) return 'grid-cols-4';   // 4x2 for 8 cards (4 pairs)
  if (numCards <= 12) return 'grid-cols-6';  // 6x2 for 12 cards (6 pairs)
  if (numCards <= 16) return 'grid-cols-8';  // 8x2 for 16 cards (8 pairs)
  if (numCards <= 20) return 'grid-cols-7';  // ~7x3 for 20 cards (10 pairs), results in 20/7 -> 3 rows
  if (numCards <= 24) return 'grid-cols-8';  // 8x3 for 24 cards (12 pairs)
  if (numCards <= 30) return 'grid-cols-10'; // 10x3 for 30 cards (15 pairs)
  if (numCards <= 36) return 'grid-cols-9';  // 9x4 for 36 cards (18 pairs)
  return 'grid-cols-8'; // Default, though settings should hit one of above
};
