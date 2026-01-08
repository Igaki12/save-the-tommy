import { Box, Button, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useGame } from "../context/GameContext";

const SetupScreen = () => {
  const { setPlayers, setKingIndex } = useGame();
  const [names, setNames] = useState<string[]>(["", ""]);
  const [error, setError] = useState<string | null>(null);

  const canAdd = names.length < 5;
  const canRemove = names.length > 2;

  const isReady = useMemo(
    () => names.every((name) => name.trim().length > 0),
    [names]
  );

  const handleChange = (index: number, value: string) => {
    setNames((prev) =>
      prev.map((name, idx) => (idx === index ? value : name))
    );
  };

  const handleStart = () => {
    if (!isReady) {
      setError("ニックネームをすべて入力してください。");
      return;
    }
    const players = names.map((name, index) => ({
      id: `player-${index}`,
      name: name.trim()
    }));
    setPlayers(players);
    setKingIndex(Math.floor(Math.random() * players.length));
  };

  return (
    <Flex direction="column" align="center" gap={8} minH="100dvh">
      <Box textAlign="center" mt={6}>
        <Text textTransform="uppercase" letterSpacing="0.4em" color="var(--neon-cyan)" fontSize="xs">
          Ultra-Strict Consent Play
        </Text>
        <Heading mt={3} fontSize="3xl" letterSpacing="0.05em">
          Save The TOMMY
        </Heading>
        <Text mt={2} color="whiteAlpha.700">
          2〜5人で遊べる“大人”向けキングスゲーム
        </Text>
      </Box>

      <VStack spacing={4} w="100%" maxW="360px">
        {names.map((name, index) => (
          <Input
            key={`name-${index}`}
            value={name}
            onChange={(event) => handleChange(index, event.target.value)}
            placeholder={`プレイヤー${index + 1}`}
            bg="#121624"
            borderColor="#2a304a"
            _focus={{ borderColor: "var(--neon-cyan)", boxShadow: "0 0 0 1px var(--neon-cyan)" }}
          />
        ))}
        <Flex gap={2} w="100%">
          <Button
            flex={1}
            variant="outline"
            borderColor="whiteAlpha.400"
            onClick={() => setNames((prev) => [...prev, ""])}
            isDisabled={!canAdd}
          >
            追加
          </Button>
          <Button
            flex={1}
            variant="outline"
            borderColor="whiteAlpha.400"
            onClick={() => setNames((prev) => prev.slice(0, -1))}
            isDisabled={!canRemove}
          >
            削除
          </Button>
        </Flex>
        {error && (
          <Text color="red.300" fontSize="sm" w="100%">
            {error}
          </Text>
        )}
      </VStack>

      <Button
        onClick={handleStart}
        size="lg"
        w="100%"
        maxW="360px"
        bg="var(--neon-pink)"
        color="#0c0f1f"
        boxShadow="0 0 20px rgba(255, 43, 209, 0.45)"
        _hover={{ bg: "#ff54dc" }}
        _active={{ transform: "scale(0.98)" }}
      >
        ゲーム開始
      </Button>

      <Text fontSize="xs" color="whiteAlpha.500" textAlign="center">
        プレイ中は画面を縦向きでお楽しみください。
      </Text>
    </Flex>
  );
};

export default SetupScreen;
