
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
  // numPairs options: 4,  6,  8,  10, 12, 15, 18, 21, 24, 25
  // numCards:       8, 12, 16, 20, 24, 30, 36, 42, 48, 50

  if (numCards <= 8) return 'grid-cols-4';    // 4 pairs (8 cards): 4x2
  if (numCards <= 12) return 'grid-cols-6';   // 6 pairs (12 cards): 6x2
  if (numCards <= 16) return 'grid-cols-8';   // 8 pairs (16 cards): 8x2
  if (numCards <= 20) return 'grid-cols-10';  // 10 pairs (20 cards): 10x2
  if (numCards <= 24) return 'grid-cols-8';   // 12 pairs (24 cards): 8x3
  if (numCards <= 30) return 'grid-cols-10';  // 15 pairs (30 cards): 10x3
  if (numCards <= 36) return 'grid-cols-9';   // 18 pairs (36 cards): 9x4
  if (numCards <= 42) return 'grid-cols-7';   // 21 pairs (42 cards): 7x6
  if (numCards <= 48) return 'grid-cols-12';  // 24 pairs (48 cards): 12x4
  if (numCards <= 50) return 'grid-cols-10';  // 25 pairs (50 cards): 10x5
  
  return 'grid-cols-10'; // Default for unexpected values (though settings should hit one of above)
};
