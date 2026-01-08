import React, { createContext, useContext, useMemo, useState } from "react";

export type Player = {
  id: string;
  name: string;
};

type GameState = {
  players: Player[];
  turn: number;
  kingIndex: number;
  consentUnlocked: boolean;
  setPlayers: (players: Player[]) => void;
  advanceTurn: () => void;
  unlockConsent: () => void;
  setKingIndex: (index: number) => void;
};

const GameContext = createContext<GameState | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [turn, setTurn] = useState(1);
  const [kingIndex, setKingIndex] = useState(0);
  const [consentUnlocked, setConsentUnlocked] = useState(false);

  const advanceTurn = () => {
    setTurn((prev) => prev + 1);
    setKingIndex((prev) => {
      if (players.length === 0) {
        return 0;
      }
      return (prev + 1) % players.length;
    });
  };

  const unlockConsent = () => setConsentUnlocked(true);

  const value = useMemo(
    () => ({
      players,
      turn,
      kingIndex,
      consentUnlocked,
      setPlayers,
      advanceTurn,
      unlockConsent,
      setKingIndex
    }),
    [players, turn, kingIndex, consentUnlocked]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within GameProvider");
  }
  return ctx;
};
