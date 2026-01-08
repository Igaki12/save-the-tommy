import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useGame } from "../context/GameContext";

const ConsentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { players, unlockConsent } = useGame();
  const [gps, setGps] = useState<{ lat: number; lng: number; timestamp: string } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "saved">("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [signerIndex, setSignerIndex] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const sigPadRef = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setGps(null);
      setGpsError(null);
      setRecordingState("idle");
      setAudioUrl(null);
      setSignatures([]);
      setSignerIndex(0);
    }
  }, [isOpen]);

  const fetchGps = () => {
    if (!navigator.geolocation) {
      setGpsError("この端末では位置情報が利用できません。");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
          timestamp: new Date(pos.timestamp).toLocaleString()
        });
      },
      () => setGpsError("位置情報の取得に失敗しました。")
    );
  };

  const startRecording = async () => {
    if (recordingState === "recording") return;
    setRecordingState("recording");
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        setRecordingState("saved");
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
    } catch (error) {
      setRecordingState("idle");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const saveSignature = () => {
    const sigPad = sigPadRef.current;
    if (!sigPad || sigPad.isEmpty()) {
      return;
    }
    const dataUrl = sigPad.getTrimmedCanvas().toDataURL("image/png");
    setSignatures((prev) => [...prev, dataUrl]);
    sigPad.clear();
    setSignerIndex((prev) => prev + 1);
  };

  const allSigned = signatures.length >= players.length;
  const isComplete = Boolean(gps) && recordingState === "saved" && allSigned;

  const handleComplete = () => {
    unlockConsent();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside">
      <ModalOverlay bg="rgba(8, 10, 18, 0.8)" />
      <ModalContent
        bg="var(--paper)"
        color="var(--ink)"
        fontFamily={'"Shippori Mincho", "Yu Mincho", serif'}
      >
        <ModalBody px={6} py={8}>
          <Flex direction="column" gap={6} minH="100dvh">
            <Box textAlign="center">
              <Text fontSize="xs" letterSpacing="0.3em" textTransform="uppercase">
                Legal Consent Protocol
              </Text>
              <Heading mt={2} fontSize="2xl" letterSpacing="0.08em">
                超厳格 同意手続書
              </Heading>
              <Text mt={2} fontSize="sm">
                不同意性交等罪に抵触しないための同意確認を行います。
              </Text>
            </Box>

            <Box bg="#fff" borderRadius="20px" p={5} boxShadow="0 20px 60px rgba(18, 19, 26, 0.15)">
              <Text fontSize="sm" lineHeight="1.9">
                私たちは本ゲームにおいて、威迫・強要・酩酊状態が一切ないことを確認し、
                相互の自由意志に基づいて身体的接触に同意します。いかなる場面でも拒否する権利を保持し、
                いつでも中止できることを理解しています。
              </Text>
            </Box>

            <Box>
              <Flex align="center" justify="space-between" mb={2}>
                <Heading size="sm">1. GPS証跡</Heading>
                {gps && <Badge colorScheme="green">取得済</Badge>}
              </Flex>
              <Button
                onClick={fetchGps}
                variant="outline"
                borderColor="gray.300"
                color="gray.700"
                w="100%"
                bg="#fff"
              >
                位置情報を取得する
              </Button>
              {gps && (
                <Box mt={3} fontSize="sm">
                  <Text>緯度: {gps.lat}</Text>
                  <Text>経度: {gps.lng}</Text>
                  <Text>時刻: {gps.timestamp}</Text>
                </Box>
              )}
              {gpsError && (
                <Text mt={2} fontSize="sm" color="red.400">
                  {gpsError}
                </Text>
              )}
            </Box>

            <Divider borderColor="gray.300" />

            <Box>
              <Flex align="center" justify="space-between" mb={2}>
                <Heading size="sm">2. 音声確認</Heading>
                {recordingState === "saved" && <Badge colorScheme="green">保存済</Badge>}
              </Flex>
              <Text fontSize="sm" mb={3}>
                "私 [Name] は、酩酊状態になく、威迫を受けておらず、自由意志に基づき、
                本ゲームにおける身体的接触に同意します。"
              </Text>
              <Button
                onPointerDown={startRecording}
                onPointerUp={stopRecording}
                onPointerLeave={stopRecording}
                bg={recordingState === "recording" ? "var(--seal)" : "#0f1a2b"}
                color="#fff"
                w="100%"
                _active={{ transform: "scale(0.98)" }}
              >
                {recordingState === "recording" ? "録音中..." : "長押しして録音"}
              </Button>
              {audioUrl && (
                <audio src={audioUrl} controls style={{ width: "100%", marginTop: "12px" }} />
              )}
            </Box>

            <Divider borderColor="gray.300" />

            <Box>
              <Flex align="center" justify="space-between" mb={2}>
                <Heading size="sm">3. 署名</Heading>
                {allSigned && <Badge colorScheme="green">完了</Badge>}
              </Flex>
              <Text fontSize="sm" mb={3}>
                {signerIndex < players.length
                  ? `${players[signerIndex]?.name ?? ""} さんの署名をお願いします。`
                  : "全員の署名が揃いました。"}
              </Text>
              <Box
                border="1px solid"
                borderColor="gray.300"
                borderRadius="12px"
                bg="#fff"
                overflow="hidden"
              >
                <SignatureCanvas
                  ref={sigPadRef}
                  penColor="#0f1a2b"
                  backgroundColor="#fff"
                  canvasProps={{ width: 320, height: 180, style: { width: "100%" } }}
                />
              </Box>
              <Flex gap={3} mt={3}>
                <Button
                  flex={1}
                  variant="outline"
                  borderColor="gray.400"
                  onClick={() => sigPadRef.current?.clear()}
                >
                  クリア
                </Button>
                <Button
                  flex={2}
                  bg="var(--seal)"
                  color="#fff"
                  onClick={saveSignature}
                  isDisabled={signerIndex >= players.length}
                >
                  署名を保存
                </Button>
              </Flex>
              <VStack mt={4} spacing={2} align="stretch">
                {players.map((player, idx) => (
                  <Flex key={player.id} align="center" justify="space-between" fontSize="sm">
                    <Text>{player.name}</Text>
                    <Badge colorScheme={signatures[idx] ? "green" : "gray"}>
                      {signatures[idx] ? "署名済" : "未署名"}
                    </Badge>
                  </Flex>
                ))}
              </VStack>
            </Box>

            <Divider borderColor="gray.300" />

            <Box bg="#fff" borderRadius="20px" p={4} position="relative" overflow="hidden">
              <Text fontSize="sm">
                手続きが完了すると、より濃密な課題が解放されます。
              </Text>
              {isComplete && (
                <Box
                  position="absolute"
                  right={4}
                  top={3}
                  w="60px"
                  h="60px"
                  borderRadius="50%"
                  border="2px solid var(--seal)"
                  color="var(--seal)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  fontWeight="700"
                  transform="rotate(-12deg)"
                  animation="stamp 0.6s ease"
                >
                  承認
                </Box>
              )}
              <Box
                sx={{
                  "@keyframes stamp": {
                    "0%": { transform: "scale(2) rotate(-20deg)", opacity: 0 },
                    "100%": { transform: "scale(1) rotate(-12deg)", opacity: 1 }
                  }
                }}
              />
            </Box>

            <Button
              onClick={handleComplete}
              isDisabled={!isComplete}
              size="lg"
              bg="var(--seal)"
              color="#fff"
              borderRadius="999px"
            >
              同意を確定してゲームへ戻る
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConsentModal;
