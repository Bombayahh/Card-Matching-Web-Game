
'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameSetup } from '@/components/game-setup';
import { GameBoard } from '@/components/game-board';
import { PlayerScores } from '@/components/player-scores';
import type { GameSettingsType, PlayerType } from '@/types';
import { Gamepad2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MatchUpMemoryPage() {
  const [gameSettings, setGameSettings] = useState<GameSettingsType | null>(null);
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<number>(1);
  const { toast } = useToast();

  // State to store the last used game settings for persistence
  const [lastNumPlayers, setLastNumPlayers] = useState<number>(1);
  const [lastPlayerNames, setLastPlayerNames] = useState<string[]>(['Player 1']);

  const initializeGameStates = useCallback((settings: GameSettingsType) => {
    const initialPlayers = Array.from({ length: settings.numPlayers }, (_, i) => ({
      id: i + 1,
      name: settings.playerNames[i] || `Player ${i + 1}`,
      score: 0,
    }));
    setPlayers(initialPlayers);
    setCurrentPlayerId(1);
    toast({ title: `Game Started!`, description: `${initialPlayers[0].name}'s turn.` });
  }, [toast]);

  const handleStartGame = (settings: GameSettingsType) => {
    setGameSettings(settings);
    initializeGameStates(settings);
    // Persist these settings for the next time GameSetup is shown
    setLastNumPlayers(settings.numPlayers);
    setLastPlayerNames(settings.playerNames);
  };

  const handlePlayAgain = () => {
    setGameSettings(null); 
    setPlayers([]);
    setCurrentPlayerId(1);
    // Player names and num players for the setup screen will be taken from lastPlayerNames and lastNumPlayers
  };

  const handlePlayerScored = useCallback((playerId: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, score: player.score + 1 } : player
      )
    );
  }, []);

  const handleNextPlayerTurn = useCallback(() => {
    if (!gameSettings || players.length === 0) return;
    const nextPlayerIndex = currentPlayerId % gameSettings.numPlayers;
    const nextPlayer = players[nextPlayerIndex];
    setCurrentPlayerId(nextPlayer.id);
    toast({
      title: `${nextPlayer.name}'s Turn`
    });
  }, [currentPlayerId, gameSettings, players, toast]);


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

      <main className="w-full flex flex-col items-center flex-grow">
        {!gameSettings ? (
          <GameSetup 
            onStartGame={handleStartGame} 
            initialNumPlayers={lastNumPlayers}
            initialPlayerNames={lastPlayerNames}
          />
        ) : (
          <div className="w-full flex flex-col md:flex-row gap-4 lg:gap-6">
            <aside className="w-full md:w-48 lg:w-56 md:sticky md:top-24 self-start">
              <PlayerScores players={players} currentPlayerId={currentPlayerId} />
            </aside>
            <section className="flex-grow">
              <GameBoard
                settings={gameSettings}
                players={players}
                currentPlayerId={currentPlayerId}
                onPlayerScored={handlePlayerScored}
                onNextPlayerTurn={handleNextPlayerTurn}
                onPlayAgain={handlePlayAgain}
              />
            </section>
          </div>
        )}
      </main>

      <footer className="mt-auto pt-8 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} MatchUp Memory. Built with Next.js & ShadCN/UI.</p>
      </footer>
    </div>
  );
}
