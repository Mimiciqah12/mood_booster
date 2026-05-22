import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const REMINDERS = [
  "Hari ini mungkin berat, tapi awak tak jalan seorang diri.",
  "Tarik nafas. Bertenang. Allah nampak usaha awak.",
  "Sedikit demi sedikit pun tetap progress.",
  "You are doing better than you think.",
  "Rehat sebentar bukan bererti kalah.",
  "Allah ada. Teruskan langkah kecil hari ini.",
  "Awak kuat, awak bernilai, awak disayangi.",
  "Semangat. Satu tugas kecil dulu, then sambung lagi.",
];

const QUOTES = [
  {
    title: "Untuk hati yang penat",
    text: "Jangan sedih. Allah tidak membebani seseorang melainkan sesuai kesanggupannya.",
    source: "Al-Baqarah 2:286",
  },
  {
    title: "Untuk waktu susah",
    text: "Sesungguhnya bersama kesulitan ada kemudahan.",
    source: "Ash-Sharh 94:5",
  },
  {
    title: "Untuk terus berharap",
    text: "Sesungguhnya bersama kesulitan ada kemudahan.",
    source: "Ash-Sharh 94:6",
  },
  {
    title: "Lembutkan hati",
    text: "Jangan putus asa. Bila terasa berat, kembali pada Allah dan terus melangkah.",
    source: "Inspired reminder",
  },
  {
    title: "Untuk yakin kembali",
    text: "Apa yang awak hadapi hari ini tidak lebih besar daripada rahmat Allah.",
    source: "Inspired reminder",
  },
  {
    title: "Pesan semangat",
    text: "Boleh menangis, boleh penat, tapi jangan hilang harap. Allah ada.",
    source: "Inspired reminder",
  },
];

const PLAY_REWARDS = [
  "✨ Allah ada, keep going.",
  "🌤️ One small step is enough.",
  "💛 Awak hebat sebab masih bertahan.",
  "🫶 Rehat, doa, then sambung.",
  "🌙 Hati tenang, kerja jadi ringan.",
  "🌈 Hard days also pass.",
];

const BURST_EMOJIS = ["✨", "🌈", "💛", "🫶", "🌤️", "⭐", "💫", "😊"];

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffleCopy(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function FloatingBurst({ id, left, size, duration, emoji, onDone }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration - 180,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(translateY, {
        toValue: -140 - Math.random() * 80,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => onDone(id));
  }, [duration, id, onDone, opacity, rotate, translateY]);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", `${Math.random() > 0.5 ? "" : "-"}22deg`],
  });

  return (
    <Animated.Text
      pointerEvents="none"
      style={[
        styles.burstEmoji,
        {
          left,
          fontSize: size,
          opacity,
          transform: [{ translateY }, { rotate: rotation }],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

function QuoteCard({ item, wide }) {
  return (
    <View style={[styles.quoteCard, wide && styles.quoteCardWide]}>
      <Text style={styles.quoteTitle}>{item.title}</Text>
      <Text style={styles.quoteText}>“{item.text}”</Text>
      <Text style={styles.quoteSource}>{item.source}</Text>
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [energy, setEnergy] = useState(0);
  const [message, setMessage] = useState(randomItem(REMINDERS));
  const [rewardText, setRewardText] = useState("Tap the button for instant semangat ✨");
  const [quotes, setQuotes] = useState(() => shuffleCopy(QUOTES));
  const [bursts, setBursts] = useState([]);

  const progressWidth = useMemo(() => {
    const max = 12;
    const value = Math.min(energy, max);
    return `${(value / max) * 100}%`;
  }, [energy]);

  const handlePlay = () => {
    setEnergy((prev) => prev + 1);
    setMessage(randomItem(REMINDERS));
    setRewardText(randomItem(PLAY_REWARDS));

    const next = Array.from({ length: 8 }).map((_, index) => ({
      id: `${Date.now()}-${index}-${Math.random()}`,
      left: 24 + Math.random() * (Math.min(width, 500) - 48),
      size: 24 + Math.random() * 16,
      duration: 1100 + Math.floor(Math.random() * 600),
      emoji: randomItem(BURST_EMOJIS),
    }));

    setBursts((prev) => [...prev, ...next]);
  };

  const removeBurst = (id) => {
    setBursts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleShuffleQuotes = () => {
    setQuotes(shuffleCopy(QUOTES));
  };

  const handleNewMessage = () => {
    setMessage(randomItem(REMINDERS));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.page}>
        {bursts.map((item) => (
          <FloatingBurst key={item.id} {...item} onDone={removeBurst} />
        ))}

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isWide && styles.scrollContentWide,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.heroCard, isWide && styles.heroCardWide]}>
            <Text style={styles.kicker}>For your friend 🤍</Text>
            <Text style={styles.title}>Happy & Semangat Corner</Text>
            <Text style={styles.subtitle}>
              A small playful page to cheer someone up, remind them that Allah is
              near, and make work feel lighter.
            </Text>

            <View style={styles.messageCard}>
              <Text style={styles.messageLabel}>Today’s reminder</Text>
              <Text style={styles.messageText}>{message}</Text>
            </View>

            <View style={styles.progressWrap}>
              <View style={styles.progressTopRow}>
                <Text style={styles.progressTitle}>Joy points</Text>
                <Text style={styles.progressValue}>{energy}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: progressWidth }]} />
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                accessibilityRole="button"
                onPress={handlePlay}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.primaryButtonPressed,
                ]}
              >
                <Text style={styles.primaryButtonText}>Tap for semangat</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={handleNewMessage}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.secondaryButtonPressed,
                ]}
              >
                <Text style={styles.secondaryButtonText}>New reminder</Text>
              </Pressable>
            </View>

            <View style={styles.rewardBox}>
              <Text style={styles.rewardText}>{rewardText}</Text>
            </View>
          </View>

          <View style={[styles.section, isWide && styles.sectionWide]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quotes to yakinkan hati</Text>
              <Pressable
                accessibilityRole="button"
                onPress={handleShuffleQuotes}
                style={({ pressed }) => [
                  styles.chipButton,
                  pressed && styles.chipButtonPressed,
                ]}
              >
                <Text style={styles.chipButtonText}>Shuffle quotes</Text>
              </Pressable>
            </View>

            <View style={[styles.quoteGrid, isWide && styles.quoteGridWide]}>
              {quotes.map((item, index) => (
                <QuoteCard key={`${item.source}-${index}`} item={item} wide={isWide} />
              ))}
            </View>
          </View>

          <View style={[styles.footerCard, isWide && styles.footerCardWide]}>
            <Text style={styles.footerTitle}>A soft note for your friend</Text>
            <Text style={styles.footerText}>
              It’s okay to feel tired. It’s okay to slow down. You are not alone,
              and this difficult season is not forever. Allah sees your effort,
              hears your doa, and knows your heart.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF9F2",
  },
  page: {
    flex: 1,
    backgroundColor: "#FFF9F2",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
    gap: 18,
  },
  scrollContentWide: {
    alignItems: "center",
  },
  heroCard: {
    width: "100%",
    maxWidth: 1120,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F3E8D9",
  },
  heroCardWide: {
    padding: 30,
  },
  kicker: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9A6B3D",
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    color: "#2F2A24",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: "#5C544C",
    maxWidth: 760,
  },
  messageCard: {
    marginTop: 18,
    backgroundColor: "#FFF4D9",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F5DE9B",
  },
  messageLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#8A632F",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  messageText: {
    fontSize: 22,
    lineHeight: 31,
    fontWeight: "700",
    color: "#433729",
  },
  progressWrap: {
    marginTop: 18,
  },
  progressTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5C544C",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#5C544C",
  },
  progressTrack: {
    height: 14,
    backgroundColor: "#F2E7DB",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFB86C",
    borderRadius: 999,
  },
  buttonRow: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#FF9F5A",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8D9C7",
  },
  secondaryButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  secondaryButtonText: {
    color: "#4E4337",
    fontSize: 16,
    fontWeight: "800",
  },
  rewardBox: {
    marginTop: 16,
    backgroundColor: "#F7F1FF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E7DBFF",
  },
  rewardText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#5A4786",
    fontWeight: "700",
  },
  section: {
    width: "100%",
    maxWidth: 1120,
  },
  sectionWide: {
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    color: "#2F2A24",
  },
  chipButton: {
    backgroundColor: "#2F2A24",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  chipButtonPressed: {
    opacity: 0.92,
  },
  chipButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
  quoteGrid: {
    gap: 12,
  },
  quoteGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  quoteCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EFE3D5",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  quoteCardWide: {
    width: "49%",
  },
  quoteTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#8A632F",
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 30,
    color: "#2F2A24",
    fontWeight: "700",
  },
  quoteSource: {
    marginTop: 12,
    fontSize: 14,
    color: "#6C6258",
    fontWeight: "600",
  },
  footerCard: {
    width: "100%",
    maxWidth: 1120,
    backgroundColor: "#2F2A24",
    borderRadius: 28,
    padding: 22,
  },
  footerCardWide: {
    padding: 28,
  },
  footerTitle: {
    color: "#FFF4E9",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },
  footerText: {
    color: "#F2E5D8",
    fontSize: 16,
    lineHeight: 25,
  },
  burstEmoji: {
    position: "absolute",
    bottom: 140,
    zIndex: 20,
  },
});