import { useFocusEffect } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type FallingItem = {
  emoji: string;
  name: string;
  lane: number;
  row: number;
  favorite: boolean;
};

const LANES = [0, 1, 2];
const ROWS = [0, 1, 2, 3, 4];
const TARGET_SCORE = 8;

const FAVORITE_FOODS = [
  { emoji: "🍕", name: "Pizza" },
  { emoji: "🍟", name: "Fries" },
  { emoji: "🍰", name: "Cake" },
  { emoji: "🧋", name: "Boba" },
  { emoji: "🍫", name: "Chocolate" },
];

const FUNNY_TRAPS = [
  { emoji: "🧦", name: "Sock" },
  { emoji: "🧼", name: "Soap" },
  { emoji: "📚", name: "Homework" },
  { emoji: "🪨", name: "Rock" },
];

const ENDING_QUOTES = [
  "Jangan bersedih lama-lama. Allah tahu apa yang hati awak sedang tahan.",
  "Hari ini mungkin berat, tapi awak masih di sini. Itu pun satu kekuatan.",
  "Semoga Allah lapangkan dada awak, tenangkan fikiran awak, dan gantikan sedih dengan senyum kecil.",
  "Awak tak perlu okay terus. Perlahan-lahan pun cukup, asalkan awak terus sayang diri sendiri.",
];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function createItem(): FallingItem {
  const favorite = Math.random() > 0.28;
  const item = favorite ? randomItem(FAVORITE_FOODS) : randomItem(FUNNY_TRAPS);

  return {
    ...item,
    favorite,
    lane: randomItem(LANES),
    row: 0,
  };
}

export default function GamesScreen(): React.JSX.Element {
  const [basketLane, setBasketLane] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);
  const [fallingItem, setFallingItem] = useState<FallingItem>(createItem);
  const [message, setMessage] = useState<string>(
    "Catch the favourite foods. Avoid the weird stuff."
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showStartPrompt, setShowStartPrompt] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [endingQuote, setEndingQuote] = useState<string>(randomItem(ENDING_QUOTES));

  const scorePercent = Math.min((score / TARGET_SCORE) * 100, 100);
  const progressWidth = useMemo<`${number}%`>(
    () => `${scorePercent}%` as `${number}%`,
    [scorePercent]
  );

  useFocusEffect(
    React.useCallback(() => {
      setBasketLane(1);
      setScore(0);
      setMisses(0);
      setFallingItem(createItem());
      setMessage("Catch the favourite foods. Avoid the weird stuff.");
      setEndingQuote(randomItem(ENDING_QUOTES));
      setIsFinished(false);
      setIsPlaying(false);
      setShowStartPrompt(true);
    }, [])
  );

  useEffect(() => {
    if (!isPlaying || isFinished) {
      return;
    }

    const gameTimer = setInterval(() => {
      setFallingItem((current) => {
        if (current.row < ROWS.length - 1) {
          return { ...current, row: current.row + 1 };
        }

        const caught = current.lane === basketLane;

        if (caught && current.favorite) {
          setScore((prev) => {
            const nextScore = prev + 1;

            if (nextScore >= TARGET_SCORE) {
              setEndingQuote(randomItem(ENDING_QUOTES));
              setIsFinished(true);
              setIsPlaying(false);
            }

            return nextScore;
          });
          setMessage(`Caught ${current.name}. Excellent snack rescue.`);
        } else if (caught && !current.favorite) {
          setMisses((prev) => prev + 1);
          setMessage(`${current.name}? Bestie, that is not food.`);
        } else if (current.favorite) {
          setMisses((prev) => prev + 1);
          setMessage(`${current.name} escaped. The basket is emotionally unavailable.`);
        } else {
          setMessage(`Dodged ${current.name}. Good survival instinct.`);
        }

        return createItem();
      });
    }, 520);

    return () => clearInterval(gameTimer);
  }, [basketLane, isFinished, isPlaying]);

  const resetGameState = (): void => {
    setBasketLane(1);
    setScore(0);
    setMisses(0);
    setFallingItem(createItem());
    setMessage("Catch the favourite foods. Avoid the weird stuff.");
    setEndingQuote(randomItem(ENDING_QUOTES));
    setIsFinished(false);
  };

  const startGame = (): void => {
    resetGameState();
    setShowStartPrompt(false);
    setIsPlaying(true);
  };

  const playAgain = (): void => {
    resetGameState();
    setShowStartPrompt(false);
    setIsPlaying(true);
  };

  const backToIntro = (): void => {
    resetGameState();
    setIsPlaying(false);
    setShowStartPrompt(true);
  };

  const moveLeft = (): void => {
    if (!isPlaying) {
      return;
    }

    setBasketLane((prev) => Math.max(prev - 1, 0));
  };

  const moveRight = (): void => {
    if (!isPlaying) {
      return;
    }

    setBasketLane((prev) => Math.min(prev + 1, LANES.length - 1));
  };

  return (
    <ScrollView contentContainerStyle={gameStyles.page} showsVerticalScrollIndicator={false}>
      <View style={gameStyles.gameCard}>
        <Text style={gameStyles.title}>Snack Catcher Rush</Text>
        <Text style={gameStyles.subtitle}>
          Move the basket. Catch yummy food. Please do not catch homework.
        </Text>

        <View style={gameStyles.scoreRow}>
          <View style={gameStyles.scorePill}>
            <Text style={gameStyles.scoreLabel}>Score</Text>
            <Text style={gameStyles.scoreValue}>
              {score}/{TARGET_SCORE}
            </Text>
          </View>
          <View style={gameStyles.scorePill}>
            <Text style={gameStyles.scoreLabel}>Oops</Text>
            <Text style={gameStyles.scoreValue}>{misses}</Text>
          </View>
        </View>

        <View style={gameStyles.progressTrack}>
          <View style={[gameStyles.progressFill, { width: progressWidth }]} />
        </View>

        <View style={gameStyles.playField}>
          {ROWS.map((row) => (
            <View key={row} style={gameStyles.fieldRow}>
              {LANES.map((lane) => {
                const hasItem = fallingItem.row === row && fallingItem.lane === lane;

                return (
                  <View key={lane} style={gameStyles.laneCell}>
                    {hasItem && isPlaying && (
                      <Text style={gameStyles.fallingEmoji}>{fallingItem.emoji}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}

          <View style={gameStyles.basketRow}>
            {LANES.map((lane) => (
              <View key={lane} style={gameStyles.laneCell}>
                {basketLane === lane && <Text style={gameStyles.basketEmoji}>🧺</Text>}
              </View>
            ))}
          </View>
        </View>

        <Text style={gameStyles.messageText}>{message}</Text>

        <View style={gameStyles.controls}>
          <Pressable
            onPress={moveLeft}
            style={({ pressed }) => [
              gameStyles.controlButton,
              !isPlaying && gameStyles.disabledButton,
              pressed && isPlaying && gameStyles.pressed,
            ]}
          >
            <Text style={gameStyles.controlText}>Left</Text>
          </Pressable>
          <Pressable
            onPress={moveRight}
            style={({ pressed }) => [
              gameStyles.controlButton,
              !isPlaying && gameStyles.disabledButton,
              pressed && isPlaying && gameStyles.pressed,
            ]}
          >
            <Text style={gameStyles.controlText}>Right</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={isFinished}
        transparent
        animationType="fade"
        onRequestClose={backToIntro}
      >
        <View style={gameStyles.modalBackdrop}>
          <View style={gameStyles.popupCard}>
            <Text style={gameStyles.popupTitle}>Snack mission complete</Text>
            <Text style={gameStyles.popupSmall}>
              You saved enough favourite food. Now here is something soft for the heart.
            </Text>
            <Text style={gameStyles.popupQuote}>{endingQuote}</Text>

            <View style={gameStyles.popupButtonRow}>
              <Pressable
                onPress={playAgain}
                style={({ pressed }) => [gameStyles.popupButton, pressed && gameStyles.pressed]}
              >
                <Text style={gameStyles.popupButtonText}>Play again</Text>
              </Pressable>
              <Pressable
                onPress={backToIntro}
                style={({ pressed }) => [
                  gameStyles.popupSecondaryButton,
                  pressed && gameStyles.pressed,
                ]}
              >
                <Text style={gameStyles.popupSecondaryButtonText}>Back</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showStartPrompt}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStartPrompt(false)}
      >
        <View style={gameStyles.modalBackdrop}>
          <View style={gameStyles.popupCard}>
            <Text style={gameStyles.popupTitle}>Nak start game?</Text>
            <Text style={gameStyles.popupSmall}>
              Catch the food, dodge the weird things, and try to reach full score.
            </Text>

            <View style={gameStyles.popupButtonRow}>
              <Pressable
                onPress={startGame}
                style={({ pressed }) => [gameStyles.popupButton, pressed && gameStyles.pressed]}
              >
                <Text style={gameStyles.popupButtonText}>Start game</Text>
              </Pressable>
              <Pressable
                onPress={() => setShowStartPrompt(false)}
                style={({ pressed }) => [
                  gameStyles.popupSecondaryButton,
                  pressed && gameStyles.pressed,
                ]}
              >
                <Text style={gameStyles.popupSecondaryButtonText}>Not now</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const gameStyles = StyleSheet.create({
  page: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: "#FFF7FC",
  },
  gameCard: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "#F3DDF4",
    shadowColor: "#AE7CFF",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    color: "#2E163B",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: "#6E5D77",
    textAlign: "center",
  },
  scoreRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  scorePill: {
    flex: 1,
    backgroundColor: "#FFF1FA",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F8D8EA",
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#8D5E9F",
    textTransform: "uppercase",
  },
  scoreValue: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "900",
    color: "#3B204B",
  },
  progressTrack: {
    marginTop: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: "#DDD3FF",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#A78BFA",
  },
  playField: {
    marginTop: 18,
    backgroundColor: "#EAF7FF",
    borderRadius: 28,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D7ECF8",
  },
  fieldRow: {
    flexDirection: "row",
    minHeight: 58,
  },
  basketRow: {
    marginTop: 8,
    flexDirection: "row",
    minHeight: 64,
    borderTopWidth: 1,
    borderTopColor: "#C6E1F0",
    paddingTop: 8,
  },
  laneCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fallingEmoji: {
    fontSize: 38,
  },
  basketEmoji: {
    fontSize: 42,
  },
  messageText: {
    marginTop: 16,
    minHeight: 54,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "800",
    color: "#31566A",
    textAlign: "center",
  },
  controls: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
  },
  controlButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#7C3AED",
    borderRadius: 18,
    paddingVertical: 16,
  },
  controlText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.45,
  },
  modalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(47, 23, 57, 0.64)",
    padding: 20,
  },
  popupCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#FFF9EC",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#F2DCA7",
    shadowColor: "#2F1739",
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  popupTitle: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "900",
    color: "#2F1739",
    textAlign: "center",
  },
  popupSmall: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    color: "#7C6291",
    textAlign: "center",
  },
  popupQuote: {
    marginTop: 16,
    fontSize: 20,
    lineHeight: 32,
    fontWeight: "800",
    color: "#594438",
    textAlign: "center",
  },
  popupButtonRow: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  popupButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  popupButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  popupSecondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#EADAF3",
  },
  popupSecondaryButtonText: {
    color: "#4A2F56",
    fontSize: 15,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.93,
    transform: [{ scale: 0.98 }],
  },
});
