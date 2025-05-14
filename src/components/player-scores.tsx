'use client';

import type { PlayerType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlayerScoresProps {
  players: PlayerType[];
  currentPlayerId: number;
}

export function PlayerScores({ players, currentPlayerId }: PlayerScoresProps) {
  return (
    <div className="w-full max-w-md mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Player Scores</h2>
      <div className={cn("grid gap-4", players.length === 1 ? "grid-cols-1" : players.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-" + (players.length > 2 ? '2' : players.length) )}>
        {players.map((player) => (
          <Card
            key={player.id}
            className={cn(
              'transition-all duration-300 ease-in-out shadow-lg',
              player.id === currentPlayerId ? 'border-primary ring-2 ring-primary scale-105 bg-primary/10' : 'bg-card'
            )}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-lg text-center">
                {player.name}
                {player.id === currentPlayerId && <span className="ml-2 text-xs">(Current Turn)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-3xl font-bold text-center text-primary">{player.score}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
