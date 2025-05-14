
'use client';

import { useState, useEffect } from 'react';
import type { GameSettingsType } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface GameSetupProps {
  onStartGame: (settings: GameSettingsType) => void;
}

const playerOptions = [1, 2, 3, 4];
const pairOptions = [
    { value: 4, label: "4 Pairs (Easy)" },
    { value: 6, label: "6 Pairs" },
    { value: 8, label: "8 Pairs (Medium)" },
    { value: 10, label: "10 Pairs" },
    { value: 12, label: "12 Pairs (Hard)" },
    { value: 15, label: "15 Pairs" },
    { value: 18, label: "18 Pairs (Expert)" },
    { value: 21, label: "21 Pairs (Challenging)" },
    { value: 24, label: "24 Pairs (Extreme)" },
    { value: 25, label: "25 Pairs (Ultimate)" },
];


export function GameSetup({ onStartGame }: GameSetupProps) {
  const [numPlayers, setNumPlayers] = useState<number>(1);
  const [numPairs, setNumPairs] = useState<number>(8);
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1']);
  const { toast } = useToast();

  useEffect(() => {
    setPlayerNames((prevNames) => {
      const newNames = Array.from({ length: numPlayers }, (_, i) => prevNames[i] || `Player ${i + 1}`);
      return newNames;
    });
  }, [numPlayers]);

  const handlePlayerNameChange = (index: number, name: string) => {
    setPlayerNames((prevNames) => {
      const newNames = [...prevNames];
      newNames[index] = name;
      return newNames;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numPlayers < 1 || numPlayers > 4) {
        toast({ title: "Invalid player number", description: "Please select between 1 and 4 players.", variant: "destructive" });
        return;
    }
    if (!pairOptions.find(p => p.value === numPairs)) {
        toast({ title: "Invalid pairs number", description: "Please select a valid number of pairs.", variant: "destructive" });
        return;
    }
    if (playerNames.some(name => name.trim() === '')) {
        toast({ title: "Invalid player name", description: "Player names cannot be empty.", variant: "destructive" });
        return;
    }
    onStartGame({ numPlayers, numPairs, playerNames });
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl"> {/* Increased max-width for side panel */}
      <CardHeader>
        <CardTitle className="text-3xl text-center">Game Setup</CardTitle>
        <CardDescription className="text-center">Customize your game!</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-0"> {/* Removed default space-y, will use flex gap */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Main Settings Panel */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="numPlayers" className="text-lg">Number of Players</Label>
                <Select
                  value={String(numPlayers)}
                  onValueChange={(value) => setNumPlayers(Number(value))}
                >
                  <SelectTrigger id="numPlayers" className="w-full text-base">
                    <SelectValue placeholder="Select number of players" />
                  </SelectTrigger>
                  <SelectContent>
                    {playerOptions.map((num) => (
                      <SelectItem key={num} value={String(num)} className="text-base">
                        {num} Player{num > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numPairs" className="text-lg">Number of Card Pairs</Label>
                <Select
                  value={String(numPairs)}
                  onValueChange={(value) => setNumPairs(Number(value))}
                >
                  <SelectTrigger id="numPairs" className="w-full text-base">
                    <SelectValue placeholder="Select number of pairs" />
                  </SelectTrigger>
                  <SelectContent>
                    {pairOptions.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)} className="text-base">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vertical Separator for md screens and up */}
            <Separator orientation="vertical" className="hidden md:block h-auto" />
            {/* Horizontal Separator for sm screens */}
            <Separator orientation="horizontal" className="block md:hidden" />


            {/* Player Names Side Panel */}
            {numPlayers > 0 && (
              <div className="md:w-64 space-y-4 flex-shrink-0"> {/* Fixed width for side panel on medium screens */}
                <h3 className="text-lg font-medium text-center md:text-left">Player Names</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {Array.from({ length: numPlayers }).map((_, index) => (
                    <div key={`player-name-${index}`} className="space-y-1.5">
                        <Label htmlFor={`playerName${index + 1}`} className="text-base">Player {index + 1}</Label>
                        <Input
                        id={`playerName${index + 1}`}
                        value={playerNames[index] || ''}
                        onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                        placeholder={`Name for Player ${index + 1}`}
                        className="w-full text-base"
                        required
                        />
                    </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-6"> {/* Add padding-top to footer */}
          <Button type="submit" className="w-full text-lg py-6">
            Start Game
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
