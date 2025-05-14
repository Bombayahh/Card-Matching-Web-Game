'use client';

import type { PlayerType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlayerScoresProps {
  players: PlayerType[];
  currentPlayerId: number;
}

export function PlayerScores({ players, currentPlayerId }: PlayerScoresProps) {
  if (!players || players.length === 0) {
    return (
      <div className="w-full p-4 text-center text-muted-foreground">
        Setting up players...
      </div>
    );
  }
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3 text-center text-foreground">Player Scores</h2>
      <div className={cn(
        "grid grid-cols-1 gap-3", 
        // Simpler grid logic for sidebar: always 1 column.
        // If more than 2 players, can adjust based on available space or keep single column for consistency.
        // For a narrow sidebar, 1 column is usually best.
        // players.length > 2 && "sm:grid-cols-2 md:grid-cols-1" // Example if you want 2 cols on sm for 3+ players
        )}>
        {players.map((player) => (
          <Card
            key={player.id}
            className={cn(
              'transition-all duration-300 ease-in-out shadow-md', // Reduced shadow
              player.id === currentPlayerId ? 'border-primary ring-2 ring-primary scale-105 bg-primary/10' : 'bg-card'
            )}
          >
            <CardHeader className="p-3"> {/* Reduced padding */}
              <CardTitle className="text-md text-center"> {/* Reduced text size */}
                {player.name}
                {player.id === currentPlayerId && <span className="block text-xs mt-1">(Current Turn)</span>} {/* Block for better layout */}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0"> {/* Reduced padding */}
              <p className="text-2xl font-bold text-center text-primary">{player.score}</p> {/* Reduced text size */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
