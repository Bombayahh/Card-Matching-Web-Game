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
    // Potentially, you could repeat icons or use a default icon for missing ones.
    // For this implementation, we'll slice, and if numPairs is too high, it will be limited by available icons.
  }

  const selectedIcons = shuffleArray(gameIconsList).slice(0, numPairs);
  
  const cards: CardType[] = [];
  selectedIcons.forEach((iconInfo, index) => {
    const pairId = `pair-${index}`;
    // Use iconInfo.component, or fallback if it's somehow undefined
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
  if (numCards <= 8) return 'grid-cols-4'; // 4x2
  if (numCards <= 12) return 'grid-cols-4'; // 4x3
  if (numCards <= 16) return 'grid-cols-4'; // 4x4
  if (numCards <= 20) return 'grid-cols-5'; // 5x4
  if (numCards <= 24) return 'grid-cols-6'; // 6x4
  if (numCards <= 30) return 'grid-cols-6'; // 6x5
  if (numCards <= 36) return 'grid-cols-6'; // 6x6
  if (numCards <= 42) return 'grid-cols-7'; // 7x6
  if (numCards <= 48) return 'grid-cols-8'; // 8x6
  return 'grid-cols-6'; // Default
};
