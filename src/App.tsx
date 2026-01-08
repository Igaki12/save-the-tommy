import { Box } from "@chakra-ui/react";
import { GameProvider, useGame } from "./context/GameContext";
import SetupScreen from "./components/SetupScreen";
import GameScreen from "./components/GameScreen";

const AppShell = () => {
  const { players } = useGame();

  return (
    <Box minH="100dvh" bg="#0b0f1c" px={4} py={6}>
      {players.length < 2 ? <SetupScreen /> : <GameScreen />}
    </Box>
  );
};

const App = () => (
  <GameProvider>
    <AppShell />
  </GameProvider>
);

export default App;
