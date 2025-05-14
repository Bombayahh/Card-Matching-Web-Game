'use client';

import { useState } from 'react';
import { GameSetup } from '@/components/game-setup';
import { GameBoard } from '@/components/game-board';
import type { GameSettingsType } from '@/types';
import { Button } from '@/components/ui/button'; // For a potential global reset button, not used yet
import { Gamepad2 } from 'lucide-react';

export default function MatchUpMemoryPage() {
  const [gameSettings, setGameSettings] = useState<GameSettingsType | null>(null);

  const handleStartGame = (settings: GameSettingsType) => {
    setGameSettings(settings);
  };

  const handlePlayAgain = () => {
    setGameSettings(null); // This will re-render GameSetup
  };

  return (
    <div className="container mx-auto px-2 py-4 md:px-4 md:py-8 flex flex-col items-center min-h-screen">
      <header className="mb-6 md:mb-10 text-center">
        <div className="inline-flex items-center gap-3 bg-primary text-primary-foreground p-3 md:p-4 rounded-lg shadow-lg">
          <Gamepad2 size={40} className="hidden md:block"/>
          <Gamepad2 size={32} className="block md:hidden"/>
          <h1 className="text-3xl md:text-4xl font-bold">
            MatchUp Memory
          </h1>
        </div>
      </header>

      <main className="w-full flex flex-col items-center">
        {!gameSettings ? (
          <GameSetup onStartGame={handleStartGame} />
        ) : (
          <GameBoard settings={gameSettings} onPlayAgain={handlePlayAgain} />
        )}
      </main>

      <footer className="mt-auto pt-8 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} MatchUp Memory. Built with Next.js & ShadCN/UI.</p>
      </footer>
    </div>
  );
}
