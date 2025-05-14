import type { LucideIcon } from 'lucide-react';

export interface CardType {
  id: string;
  pairId: string;
  iconName: string; // Store icon name for easier debugging/logging if needed
  IconComponent: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface PlayerType {
  id: number;
  name: string;
  score: number;
}

export interface GameSettingsType {
  numPlayers: number;
  numPairs: number;
  playerNames: string[];
}
