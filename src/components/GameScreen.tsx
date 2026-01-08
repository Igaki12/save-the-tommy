import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useGame } from "../context/GameContext";
import { TaskCard, taskDeck } from "../data/tasks";
import ConsentModal from "./ConsentModal";

const pickCards = (tasks: TaskCard[]) => {
  const shuffled = [...tasks].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

const GameScreen = () => {
  const { players, kingIndex, turn, advanceTurn, consentUnlocked } = useGame();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCard, setSelectedCard] = useState<TaskCard | null>(null);
  const [cards, setCards] = useState<TaskCard[]>(() =>
    pickCards(taskDeck.filter((task) => task.intensity === "soft"))
  );

  const king = players[kingIndex];
  const targets = useMemo(
    () => players.filter((_, idx) => idx !== kingIndex),
    [players, kingIndex]
  );

  const availableDeck = consentUnlocked
    ? taskDeck
    : taskDeck.filter((task) => task.intensity === "soft");

  const handleSelect = (card: TaskCard) => {
    setSelectedCard(card);
  };

  const handleNext = () => {
    setSelectedCard(null);
    setCards(pickCards(availableDeck));
    advanceTurn();
  };

  const showConsentButton = turn >= 3;
  const pulseConsent = turn >= 5 && !consentUnlocked;

  return (
    <Box minH="100dvh" pb={10}>
      <Flex align="center" justify="space-between" mb={6}>
        <Box>
          <Text fontSize="xs" color="whiteAlpha.600" letterSpacing="0.2em" textTransform="uppercase">
            Turn {turn}
          </Text>
          <Heading size="lg">キング: {king?.name ?? ""}</Heading>
        </Box>
        <Badge
          px={3}
          py={1}
          bg={consentUnlocked ? "var(--neon-cyan)" : "#1d2235"}
          color={consentUnlocked ? "#0b0f1c" : "white"}
          borderRadius="full"
        >
          {consentUnlocked ? "Deep Mode" : "Soft Mode"}
        </Badge>
      </Flex>

      <Box mb={4}>
        <Text fontSize="sm" color="whiteAlpha.700">
          ターゲット: {targets.map((player) => player.name).join("・")}
        </Text>
      </Box>

      <Grid gap={4}>
        {cards.map((card) => {
          const isSelected = selectedCard?.id === card.id;
          return (
            <Button
              key={card.id}
              onClick={() => handleSelect(card)}
              h="auto"
              py={6}
              px={5}
              textAlign="left"
              borderRadius="20px"
              bg={isSelected ? "rgba(38, 246, 255, 0.18)" : "#121625"}
              border="1px solid"
              borderColor={isSelected ? "var(--neon-cyan)" : "#2b314a"}
              boxShadow={isSelected ? "0 0 20px rgba(38, 246, 255, 0.35)" : "none"}
              _hover={{ borderColor: "var(--neon-cyan)" }}
            >
              <Box>
                <Text fontSize="xs" color="whiteAlpha.500" mb={2}>
                  {isSelected ? "Full Command" : "Masked Hint"}
                </Text>
                <Heading size="md" fontWeight="600">
                  {isSelected ? card.full : card.preview}
                </Heading>
              </Box>
            </Button>
          );
        })}
      </Grid>

      {showConsentButton && !consentUnlocked && (
        <Button
          mt={6}
          w="100%"
          size="lg"
          onClick={onOpen}
          bg="#f8f3ea"
          color="#0d0f1a"
          borderRadius="999px"
          position="relative"
          overflow="hidden"
          _hover={{ bg: "#f0e6d5" }}
          _after={
            pulseConsent
              ? {
                  content: '""',
                  position: "absolute",
                  inset: "-6px",
                  borderRadius: "999px",
                  border: "2px solid #f8f3ea",
                  animation: "pulse 2s infinite",
                  opacity: 0.6
                }
              : undefined
          }
          sx={{
            "@keyframes pulse": {
              "0%": { transform: "scale(0.9)", opacity: 0.4 },
              "70%": { transform: "scale(1.1)", opacity: 0 },
              "100%": { opacity: 0 }
            }
          }}
        >
          同意手続きを開始
        </Button>
      )}

      <Button
        mt={6}
        w="100%"
        size="lg"
        onClick={handleNext}
        isDisabled={!selectedCard}
        bg="var(--neon-pink)"
        color="#0b0f1c"
        boxShadow="0 0 22px rgba(255, 43, 209, 0.45)"
      >
        次のターンへ
      </Button>

      <ConsentModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default GameScreen;
