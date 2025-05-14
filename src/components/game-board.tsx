'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CardType, PlayerType, GameSettingsType } from '@/types';
import { generateCardSet, getGridColsClass } from '@/lib/game-utils';
import { MemoryCard } from './memory-card';
import { PlayerScores } from './player-scores';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Confetti } from 'lucide-react';

interface GameBoardProps {
  settings: GameSettingsType;
  onPlayAgain: () => void;
}

export function GameBoard({ settings, onPlayAgain }: GameBoardProps) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<number>(1);
  const [flippedCards, setFlippedCards] = useState<CardType[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing');
  const [winner, setWinner] = useState<PlayerType | PlayerType[] | null>(null);
  const [showWinDialog, setShowWinDialog] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    // Initialize game
    setCards(generateCardSet(settings.numPairs));
    const initialPlayers = Array.from({ length: settings.numPlayers }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      score: 0,
    }));
    setPlayers(initialPlayers);
    setCurrentPlayerId(1);
    setFlippedCards([]);
    setIsChecking(false);
    setGameStatus('playing');
    setWinner(null);
    setShowWinDialog(false);
    toast({ title: `Game Started!`, description: `Player 1's turn.` });
  }, [settings, toast]);

  const resetFlippedCards = useCallback(() => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        flippedCards.find(fc => fc.id === card.id) && !card.isMatched
          ? { ...card, isFlipped: false }
          : card
      )
    );
    setFlippedCards([]);
    setIsChecking(false);
  }, [flippedCards]);

  const checkForMatch = useCallback(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      const [firstCard, secondCard] = flippedCards;

      if (firstCard.pairId === secondCard.pairId) {
        // Match found
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.pairId === firstCard.pairId ? { ...card, isMatched: true, isFlipped: true } : card
          )
        );
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.id === currentPlayerId ? { ...player, score: player.score + 1 } : player
          )
        );
        toast({
          title: "Match Found!",
          description: `${players.find(p=>p.id === currentPlayerId)?.name || 'Current player'} scored a point!`,
          className: "bg-accent text-accent-foreground"
        });
        setFlippedCards([]);
        setIsChecking(false);
        
        // Check for game end after state updates
      } else {
        // No match
        toast({
          title: "No Match!",
          description: "Try again.",
          variant: "destructive"
        });
        setTimeout(() => {
          resetFlippedCards();
          setCurrentPlayerId((prevId) => (prevId % settings.numPlayers) + 1);
          setTimeout(() => { // ensure player change is announced after cards flip back
            toast({
              title: `Player ${ (currentPlayerId % settings.numPlayers) + 1}'s Turn`
            });
          }, 100);
        }, 1200); // Delay to show cards before flipping back
      }
    }
  }, [flippedCards, currentPlayerId, settings.numPlayers, resetFlippedCards, toast, players]);
  
  useEffect(() => {
    if (flippedCards.length === 2) {
      checkForMatch();
    }
  }, [flippedCards, checkForMatch]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameStatus('finished');
      const maxScore = Math.max(...players.map(p => p.score));
      const winners = players.filter(p => p.score === maxScore);
      setWinner(winners.length === 1 ? winners[0] : winners); // Handle single or multiple winners (tie)
      setShowWinDialog(true);
    }
  }, [cards, players]);


  const handleCardClick = (cardId: string) => {
    if (isChecking || flippedCards.length === 2) return;

    const clickedCard = cards.find((card) => card.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    // Prevent clicking the same card twice in a turn for single card selection
    if (flippedCards.length === 1 && flippedCards[0].id === cardId) return;


    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards((prevFlipped) => [...prevFlipped, { ...clickedCard, isFlipped: true }]);
  };

  const gridColsClass = getGridColsClass(cards.length);

  if (!cards.length || !players.length) {
    return <p className="text-xl">Loading game...</p>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <PlayerScores players={players} currentPlayerId={currentPlayerId} />
      
      <div className={`card-grid ${gridColsClass} w-full max-w-3xl mb-8`}>
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            onCardClick={handleCardClick}
            disabled={isChecking || card.isMatched || (flippedCards.length === 2)}
          />
        ))}
      </div>

      {gameStatus === 'finished' && showWinDialog && (
         <AlertDialog open={showWinDialog} onOpenChange={setShowWinDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
                    <Confetti className="text-yellow-400" size={32} /> Game Over! <Confetti className="text-yellow-400" size={32} />
                </AlertDialogTitle>
                <AlertDialogDescription className="text-lg text-center py-4">
                    {winner && Array.isArray(winner) && winner.length > 1 
                    ? `It's a tie between ${winner.map(w => w.name).join(' and ')} with ${winner[0].score} points!`
                    : winner && !Array.isArray(winner) 
                    ? `${winner.name} wins with ${winner.score} points!`
                    : "Great game!"}
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogAction onClick={onPlayAgain} className="w-full text-lg py-3">
                    Play Again
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
