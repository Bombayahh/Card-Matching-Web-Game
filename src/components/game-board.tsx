'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CardType, PlayerType, GameSettingsType } from '@/types';
import { generateCardSet, getGridColsClass } from '@/lib/game-utils';
import { MemoryCard } from './memory-card';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PartyPopper } from 'lucide-react';

interface GameBoardProps {
  settings: GameSettingsType;
  players: PlayerType[]; 
  currentPlayerId: number; 
  onPlayerScored: (playerId: number) => void; 
  onNextPlayerTurn: () => void; 
  onPlayAgain: () => void;
}

export function GameBoard({ settings, players, currentPlayerId, onPlayerScored, onNextPlayerTurn, onPlayAgain }: GameBoardProps) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardType[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing');
  const [winner, setWinner] = useState<PlayerType | PlayerType[] | null>(null);
  const [showWinDialog, setShowWinDialog] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setCards(generateCardSet(settings.numPairs));
    setFlippedCards([]);
    setIsChecking(false);
    setGameStatus('playing');
    setWinner(null);
    setShowWinDialog(false);
  }, [settings]);

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
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.pairId === firstCard.pairId ? { ...card, isMatched: true, isFlipped: true } : card
          )
        );
        onPlayerScored(currentPlayerId); 
        
        toast({
          title: "Match Found!",
          description: `${players.find(p=>p.id === currentPlayerId)?.name || 'Current player'} scored a point!`,
          className: "bg-accent text-accent-foreground"
        });
        setFlippedCards([]);
        setIsChecking(false);
        
      } else {
        toast({
          title: "No Match!",
          description: "Try again.",
          variant: "destructive"
        });
        setTimeout(() => {
          resetFlippedCards();
          onNextPlayerTurn(); 
        }, 1200); 
      }
    }
  }, [flippedCards, currentPlayerId, onPlayerScored, onNextPlayerTurn, resetFlippedCards, toast, players]);
  
  useEffect(() => {
    if (flippedCards.length === 2) {
      checkForMatch();
    }
  }, [flippedCards, checkForMatch]);

  useEffect(() => {
    if (cards.length > 0 && players.length > 0 && cards.every(card => card.isMatched)) {
      setGameStatus('finished');
      const maxScore = Math.max(...players.map(p => p.score));
      const winners = players.filter(p => p.score === maxScore);
      setWinner(winners.length === 1 ? winners[0] : winners); 
      setShowWinDialog(true);
    }
  }, [cards, players]);


  const handleCardClick = (cardId: string) => {
    if (isChecking || flippedCards.length === 2) return;

    const clickedCard = cards.find((card) => card.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    if (flippedCards.length === 1 && flippedCards[0].id === cardId) return;

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards((prevFlipped) => [...prevFlipped, { ...clickedCard, isFlipped: true }]);
  };

  const gridColsClass = getGridColsClass(cards.length);

  if (!cards.length) {
    return <p className="text-xl text-center">Loading game cards...</p>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className={`card-grid ${gridColsClass} w-full max-w-5xl mb-8`}> {/* max-w increased */}
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
                    <PartyPopper className="text-yellow-400" size={32} /> Game Over! <PartyPopper className="text-yellow-400" size={32} />
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
