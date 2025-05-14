'use client';

import { useState } from 'react';
import type { GameSettingsType } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface GameSetupProps {
  onStartGame: (settings: GameSettingsType) => void;
}

const playerOptions = [1, 2, 3, 4];
// 8, 12, 16, 20, 24, 30, 36 cards
const pairOptions = [
    { value: 4, label: "4 Pairs (Easy)" }, // 8 cards
    { value: 6, label: "6 Pairs" }, // 12 cards
    { value: 8, label: "8 Pairs (Medium)" }, // 16 cards
    { value: 10, label: "10 Pairs" }, // 20 cards
    { value: 12, label: "12 Pairs (Hard)" }, // 24 cards
    { value: 15, label: "15 Pairs" }, // 30 cards
    { value: 18, label: "18 Pairs (Expert)" } // 36 cards
];


export function GameSetup({ onStartGame }: GameSetupProps) {
  const [numPlayers, setNumPlayers] = useState<number>(1);
  const [numPairs, setNumPairs] = useState<number>(8); // Default to Medium
  const { toast } = useToast();

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
    onStartGame({ numPlayers, numPairs });
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl text-center">Game Setup</CardTitle>
        <CardDescription className="text-center">Customize your game!</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
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
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full text-lg py-6">
            Start Game
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
