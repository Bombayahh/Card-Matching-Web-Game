'use client';

import type { PlayerType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlayerScoresProps {
  players: PlayerType[];
  currentPlayerId: number;
}

// Define player-specific colors
const playerColorConfig: Record<number, { background: string; foreground: string }> = {
  1: { background: 'hsl(0, 70%, 60%)', foreground: 'hsl(0, 0%, 100%)' },    // Player 1: Red background, White text
  2: { background: 'hsl(30, 80%, 60%)', foreground: 'hsl(30, 70%, 10%)' },  // Player 2: Orange background, Dark Brown text
  3: { background: 'hsl(120, 60%, 50%)', foreground: 'hsl(120, 0%, 100%)' }, // Player 3: Green background, White text
  4: { background: 'hsl(270, 50%, 60%)', foreground: 'hsl(270, 0%, 100%)' }, // Player 4: Purple background, White text
};

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
        {players.map((player) => {
          const colors = playerColorConfig[player.id] || { background: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' }; // Fallback to theme default

          return (
            <Card
              key={player.id}
              className={cn(
                'transition-all duration-300 ease-in-out shadow-md',
                player.id === currentPlayerId && 'border-primary ring-2 ring-primary scale-105'
                // Removed bg-card and bg-primary/10, background color is now handled by inline style
              )}
              style={{ backgroundColor: colors.background, color: colors.foreground }}
            >
              <CardHeader className="p-2.5"> {/* Reduced padding */}
                <CardTitle className="text-base text-center" style={{ color: colors.foreground }}> {/* Adjusted text size and color */}
                  {player.name}
                  {player.id === currentPlayerId && (
                    <span className="block text-xs mt-1" style={{ color: colors.foreground }}>
                      (Current Turn)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2.5 pt-0"> {/* Reduced padding */}
                <p className="text-xl font-bold text-center" style={{ color: colors.foreground }}> {/* Adjusted text size and color */}
                  {player.score}
                </p> 
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
