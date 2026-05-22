import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const MUSIC_SOURCE = require("../../assets/music.mp3");

const HERO_LINES = [
  "Jangan sedih, Allah ada.",
  "Awak tak perlu kuat seorang diri.",
  "Hari ini susah, tapi awak masih bertahan.",
  "Tenang. Allah tahu isi hati awak.",
];

const SUPPORT_LINES = [
  "Semangat kecil pun tetap semangat.",
  "One tiny step is still progress.",
  "Allah nampak usaha yang orang lain tak nampak.",
  "Rest is allowed. Giving up is not required.",
];

const LOVE_LETTER = `Untuk awak yang sangat istimewa,

Kalau hari ini rasa berat, tarik nafas perlahan-lahan dulu. Awak tak perlu kuat setiap masa. Awak juga manusia, dan manusia boleh penat, boleh sedih, boleh rasa kosong sekejap.

Saya cuma nak awak tahu, kewujudan awak sangat berharga. Cara awak terus cuba walaupun hati penat itu bukan benda kecil. Itu tanda awak masih ada harapan dalam diri, walaupun kadang-kadang awak sendiri tak nampak.

Jangan simpan sedih itu terlalu lama seorang diri. Allah tahu apa yang awak pendam, Allah nampak usaha awak, dan Allah dengar doa yang awak bisikkan dalam diam.

Awak tak perlu sempurna untuk disayangi. Awak tak perlu sentiasa ceria untuk dianggap kuat. Awak tetap special, tetap berharga, dan tetap layak untuk hari-hari yang lembut.

Semoga hati awak perlahan-lahan tenang, fikiran awak jadi ringan, dan senyum kecil datang balik walaupun sedikit demi sedikit.

Teruskan hidup, ya. Dunia masih perlukan awak yang baik hati ini.`;

const HEART_CALM_MESSAGE = `Take a slow breath.

You made it to 100%, but you do not have to be 100% all the time.

Even when your heart feels tired, Allah still knows your name, your effort, and every quiet thing you are carrying.

May your chest feel lighter, your thoughts become softer, and your day give you one small reason to smile.`;

export default function HomeScreen(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const player = useAudioPlayer(MUSIC_SOURCE, { updateInterval: 250 });
  const musicStatus = useAudioPlayerStatus(player);
  const letterScale = useRef(new Animated.Value(0.94)).current;
  const calmScale = useRef(new Animated.Value(0.94)).current;

  const [points, setPoints] = useState<number>(0);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [isLetterOpen, setIsLetterOpen] = useState<boolean>(false);
  const [isCalmOpen, setIsCalmOpen] = useState<boolean>(false);
  const [hasShownCalm, setHasShownCalm] = useState<boolean>(false);
  const [typedLetter, setTypedLetter] = useState<string>("");

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "duckOthers",
    });
  }, []);

  useEffect(() => {
    player.loop = true;
    player.volume = 0.45;
  }, [player]);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % HERO_LINES.length);
    }, 3000);

    return () => clearInterval(quoteTimer);
  }, []);

  useEffect(() => {
    if (!isLetterOpen) {
      setTypedLetter("");
      return;
    }

    setTypedLetter("");
    letterScale.setValue(0.94);

    Animated.spring(letterScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    let nextIndex = 0;
    const typing = setInterval(() => {
      nextIndex += 1;
      setTypedLetter(LOVE_LETTER.slice(0, nextIndex));

      if (nextIndex >= LOVE_LETTER.length) {
        clearInterval(typing);
      }
    }, 28);

    return () => clearInterval(typing);
  }, [isLetterOpen, letterScale]);

  useEffect(() => {
    if (!isCalmOpen) {
      return;
    }

    calmScale.setValue(0.94);

    Animated.spring(calmScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [calmScale, isCalmOpen]);

  const progressWidth = useMemo<`${number}%`>(
    () => `${Math.min(points, 10) * 10}%` as `${number}%`,
    [points]
  );

  const energyPercent = Math.min(points, 10) * 10;
  const heroLine = HERO_LINES[quoteIndex];
  const supportLine = SUPPORT_LINES[quoteIndex % SUPPORT_LINES.length];

  const startBackgroundMusic = async (): Promise<void> => {
    if (musicStatus.playing) {
      return;
    }

    if (musicStatus.didJustFinish) {
      await player.seekTo(0);
    }

    player.play();
  };

  const stopBackgroundMusic = (): void => {
    player.pause();
  };

  const onCheerTap = (): void => {
    void startBackgroundMusic();
    setPoints((prev) => {
      const next = Math.min(prev + 1, 10);

      if (next === 10 && !hasShownCalm) {
        setHasShownCalm(true);
        setIsCalmOpen(true);
      }

      return next;
    });
  };

  const onOpenLetter = (): void => {
    void startBackgroundMusic();
    setIsLetterOpen(true);
  };

  return (
    <View style={homeStyles.page}>
      <ScrollView
        contentContainerStyle={[homeStyles.content, isWide && homeStyles.contentWide]}
        showsVerticalScrollIndicator={false}
      >
        <View style={homeStyles.hero}>
          <Text style={homeStyles.title}>Little Heart Garden</Text>
          <Text style={homeStyles.subtitle}>
            A soft place to breathe, collect tiny joy, and feel a little lighter.
          </Text>

          <View style={homeStyles.mainQuoteCard}>
            <Text style={homeStyles.mainQuoteText}>{`"${heroLine}"`}</Text>
            <Text style={homeStyles.mainQuoteSub}>{supportLine}</Text>
          </View>

          <View style={homeStyles.notePanel}>
            <Text style={homeStyles.loveSparkles}>♡ ˖ ♡ ˖ ♡</Text>
            <Text style={homeStyles.noteLabel}>Secret love letter</Text>
            <Text style={homeStyles.noteText}>
              A special letter is waiting. Open it slowly.
            </Text>
            <Pressable
              onPress={onOpenLetter}
              style={({ pressed }) => [homeStyles.noteButton, pressed && homeStyles.pressed]}
            >
              <Text style={homeStyles.noteButtonText}>Open love letter</Text>
            </Pressable>
            <Text style={homeStyles.loveSparklesBottom}>♡ ♡ ♡</Text>
          </View>

          <View style={homeStyles.progressCard}>
            <View style={homeStyles.progressRow}>
              <Text style={homeStyles.progressLabel}>Happy energy</Text>
              <Text style={homeStyles.progressValue}>{energyPercent}%</Text>
            </View>
            <View style={homeStyles.progressTrack}>
              <View style={[homeStyles.progressFill, { width: progressWidth }]} />
            </View>
          </View>

          <View style={homeStyles.heroButtons}>
            <Pressable
              onPress={onCheerTap}
              style={({ pressed }) => [
                homeStyles.primaryButton,
                energyPercent === 100 && homeStyles.primaryButtonComplete,
                pressed && homeStyles.pressed,
              ]}
            >
              <Text style={homeStyles.primaryButtonText}>
                {energyPercent === 100 ? "Send more calm" : "Cheer me up"}
              </Text>
            </Pressable>

          </View>
        </View>
      </ScrollView>

      <Pressable
        disabled={!musicStatus.playing}
        onPress={stopBackgroundMusic}
        style={({ pressed }) => [
          homeStyles.floatingSoundButton,
          !musicStatus.playing && homeStyles.floatingSoundButtonDisabled,
          pressed && musicStatus.playing && homeStyles.pressed,
        ]}
      >
        <Text style={homeStyles.floatingSoundIcon}>📻</Text>
      </Pressable>

      <Modal
        visible={isLetterOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLetterOpen(false)}
      >
        <View style={homeStyles.modalBackdrop}>
          <Animated.View
            style={[homeStyles.letterShell, { transform: [{ scale: letterScale }] }]}
          >
            <View style={homeStyles.letterFold} />
            <Text style={homeStyles.letterKicker}>A little letter</Text>
            <ScrollView
              style={homeStyles.letterScroll}
              contentContainerStyle={homeStyles.letterScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={homeStyles.letterText}>{typedLetter}</Text>
            </ScrollView>
            {typedLetter.length >= LOVE_LETTER.length && (
              <Pressable
                onPress={() => setIsLetterOpen(false)}
                style={({ pressed }) => [homeStyles.backHomeButton, pressed && homeStyles.pressed]}
              >
                <Text style={homeStyles.backHomeButtonText}>Back home</Text>
              </Pressable>
            )}
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={isCalmOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCalmOpen(false)}
      >
        <View style={homeStyles.modalBackdrop}>
          <Animated.View
            style={[homeStyles.calmShell, { transform: [{ scale: calmScale }] }]}
          >
            <Text style={homeStyles.calmTitle}>Your heart can rest now</Text>
            <Text style={homeStyles.calmText}>{HEART_CALM_MESSAGE}</Text>
            <Pressable
              onPress={() => setIsCalmOpen(false)}
              style={({ pressed }) => [homeStyles.backHomeButton, pressed && homeStyles.pressed]}
            >
              <Text style={homeStyles.backHomeButtonText}>Back home</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const homeStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFF7FC",
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 16,
  },
  contentWide: {
    alignItems: "center",
  },
  hero: {
    width: "100%",
    maxWidth: 1100,
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
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
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "900",
    color: "#2F1739",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: "#6E5D77",
    textAlign: "center",
  },
  mainQuoteCard: {
    marginTop: 18,
    backgroundColor: "#FFF1FA",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F8D8EA",
  },
  mainQuoteText: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "900",
    color: "#45285B",
    textAlign: "center",
  },
  mainQuoteSub: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: "#7A6389",
    textAlign: "center",
  },
  notePanel: {
    marginTop: 18,
    minHeight: 230,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFAE8",
    borderRadius: 30,
    paddingHorizontal: 26,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: "#F5E4A8",
  },
  loveSparkles: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
    color: "#D85C8A",
    textAlign: "center",
    marginBottom: 8,
  },
  loveSparklesBottom: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
    color: "#D85C8A",
    textAlign: "center",
  },
  noteLabel: {
    fontSize: 15,
    fontWeight: "900",
    color: "#9A6B00",
    textAlign: "center",
    textTransform: "uppercase",
  },
  noteText: {
    marginTop: 12,
    fontSize: 22,
    lineHeight: 32,
    fontWeight: "800",
    color: "#4B3723",
    textAlign: "center",
  },
  noteButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#F0DB8A",
  },
  noteButtonText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#6C4B00",
  },
  progressCard: {
    marginTop: 16,
    backgroundColor: "#F2EEFF",
    borderRadius: 22,
    padding: 16,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#614AA8",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#614AA8",
  },
  progressTrack: {
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
  heroButtons: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
  },
  primaryButtonComplete: {
    backgroundColor: "#FF6FAE",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },
  floatingSoundButton: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#EADAF3",
    shadowColor: "#2F1739",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
    zIndex: 20,
  },
  floatingSoundButtonDisabled: {
    opacity: 0.42,
  },
  floatingSoundIcon: {
    fontSize: 26,
  },
  modalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(47, 23, 57, 0.64)",
    padding: 20,
  },
  letterShell: {
    width: "100%",
    maxWidth: 680,
    minHeight: "70%",
    maxHeight: "92%",
    backgroundColor: "#FFF9EC",
    borderRadius: 26,
    padding: 26,
    borderWidth: 1,
    borderColor: "#F2DCA7",
    shadowColor: "#2F1739",
    shadowOpacity: 0.26,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  letterFold: {
    alignSelf: "center",
    width: 96,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#E9C875",
    marginBottom: 14,
  },
  letterKicker: {
    fontSize: 13,
    fontWeight: "900",
    color: "#9A6B00",
    textAlign: "center",
    textTransform: "uppercase",
  },
  letterScroll: {
    marginTop: 14,
    flexGrow: 0,
  },
  letterScrollContent: {
    paddingBottom: 10,
  },
  letterText: {
    fontSize: 20,
    lineHeight: 33,
    fontWeight: "700",
    color: "#4A3327",
  },
  backHomeButton: {
    marginTop: 18,
    alignSelf: "center",
    backgroundColor: "#7C3AED",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  backHomeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  calmShell: {
    width: "100%",
    maxWidth: 500,
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
  calmTitle: {
    marginTop: 10,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "900",
    color: "#2F1739",
    textAlign: "center",
  },
  calmText: {
    marginTop: 14,
    fontSize: 17,
    lineHeight: 28,
    fontWeight: "700",
    color: "#594438",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.93,
    transform: [{ scale: 0.98 }],
  },
});
