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
        )}>
        {players.map((player) => (
          <Card
            key={player.id}
            className={cn(
              'transition-all duration-300 ease-in-out shadow-md',
              player.id === currentPlayerId ? 'border-primary ring-2 ring-primary scale-105 bg-primary/10' : 'bg-card'
            )}
          >
            <CardHeader className="p-2.5"> {/* Reduced padding */}
              <CardTitle className="text-base text-center"> {/* Adjusted text size */}
                {player.name}
                {player.id === currentPlayerId && <span className="block text-xs mt-1">(Current Turn)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2.5 pt-0"> {/* Reduced padding */}
              <p className="text-xl font-bold text-center text-primary">{player.score}</p> {/* Adjusted text size */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
