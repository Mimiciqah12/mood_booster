import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(1)).current;

  const quotes = [
    "Allah tidak pernah silap dalam mengatur hidup awak, so kita kene yakin setiap yang berlaku pasti ada ganjarannya suatu hari nanti.",
    "Tenanglah, apa yang ditakdirkan untuk awak pasti akan sampai kepada awak juga nanti.",
    "Jangan terlalu risau. Allah tahu apa yang terbaik untuk awak.",
    "Kadang Allah tangguhkan sesuatu kerana Dia mahu beri yang lebih baik.",
    "Senyum. Kamu sedang dijaga oleh Allah dalam cara yang kamu belum nampak.",
    "Percaya pada takdir Allah. Setiap yang berlaku pasti ada hikmahnya.",
    "Hari ini mungkin berat, tapi Allah tidak akan membebani hamba-Nya melebihi kemampuan.",
    "Semoga Amir diberikan kebahagiaan yang melimpah dan selalu dikelilingi oleh orang-orang yang baik. ",
    "Semoga dapat siapkan lab and FYP dengan lancar dan dapat hasil yang memuaskan.",
    "Semoga Amir tak kene marah dengan lecturer nanti oceyyy, so dont be so sad and just be happy.",
    "Last but not least, semoga Amir sentiasa kuat, bahagia, dan terus percaya bahawa aturan Allah itu sentiasa yang terbaik 🤍",
  ];

  const mainText =
    "Assalamualaikum, Amir Zafran. I hope you will be happy untuk sepanjang hari ini ✨";

  const [quote, setQuote] = useState(mainText);
  const [typedQuote, setTypedQuote] = useState(mainText);
  const [index, setIndex] = useState(-1);

  const isLastPage = index === quotes.length - 1;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float1, {
          toValue: -25,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(float1, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float2, {
          toValue: 25,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(float2, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    setTypedQuote("");

    let currentText = "";
    let currentIndex = 0;

    const typing = setInterval(() => {
      currentText += quote[currentIndex];
      setTypedQuote(currentText);
      currentIndex++;

      if (currentIndex >= quote.length) {
        clearInterval(typing);
      }
    }, 35);

    return () => clearInterval(typing);
  }, [quote]);

  const playAnimation = (isFinal: boolean) => {
    Animated.sequence([
      Animated.timing(fade, {
        toValue: 0.4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: isFinal ? 1.18 : 1.08,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const nextQuote = () => {
    if (isLastPage) return;

    const nextIndex = index + 1;
    setIndex(nextIndex);
    setQuote(quotes[nextIndex]);
    playAnimation(nextIndex === quotes.length - 1);
  };

  const backToMain = () => {
    setIndex(-1);
    setQuote(mainText);
    playAnimation(false);
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.cloudOne, { transform: [{ translateY: float1 }] }]}>
        ☁️
      </Animated.Text>

      <Animated.Text style={[styles.cloudTwo, { transform: [{ translateY: float2 }] }]}>
        ☁️
      </Animated.Text>

      <Animated.Text style={[styles.sparkleOne, { transform: [{ translateY: float1 }] }]}>
        ✨
      </Animated.Text>

      <Animated.Text style={[styles.sparkleTwo, { transform: [{ translateY: float2 }] }]}>
        🌟
      </Animated.Text>

      <Animated.Text style={[styles.sparkleThree, { transform: [{ translateY: float1 }] }]}>
        ✨
      </Animated.Text>

      <Animated.Text style={[styles.sparkleFour, { transform: [{ translateY: float2 }] }]}>
        ⭐
      </Animated.Text>

      <Animated.Text style={[styles.sparkleFive, { transform: [{ translateY: float1 }] }]}>
        💫
      </Animated.Text>

      <Animated.Text style={[styles.sparkleSix, { transform: [{ translateY: float2 }] }]}>
        ✨
      </Animated.Text>

      <Animated.Text style={[styles.loveOne, { transform: [{ translateY: float1 }] }]}>
        💙
      </Animated.Text>

      <Text style={styles.title}>Hi, Amir</Text>
      <Text style={styles.subtitle}>Always be happy & senyum selalu oceyy 🤍</Text>

      <Animated.View
        style={[
          styles.card,
          {
            opacity: fade,
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={styles.quote}>“{typedQuote}”</Text>

        {isLastPage && (
          <Animated.Text style={[styles.finalEmoji, { transform: [{ scale }] }]}>
            ✨🌟🤍🌟✨
          </Animated.Text>
        )}
      </Animated.View>

      {!isLastPage && (
        <TouchableOpacity style={styles.button} onPress={nextQuote}>
          <Text style={styles.buttonText}>Tekan untuk lihat ayat seterusnya ✨</Text>
        </TouchableOpacity>
      )}

      {isLastPage && (
        <View style={styles.lastPageContainer}>
          <Text style={styles.doneText}>Selesai ✨🤍✨</Text>

          <TouchableOpacity style={styles.backButton} onPress={backToMain}>
            <Text style={styles.backButtonText}>Kembali ke Awal ↺</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.footer}>
        Ingat, Allah sentiasa ada bersama kamu.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF6FF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    overflow: "hidden",
  },
  cloudOne: {
    position: "absolute",
    top: 40,
    left: 25,
    fontSize: 42,
    opacity: 0.75,
  },
  cloudTwo: {
    position: "absolute",
    bottom: 55,
    right: 30,
    fontSize: 46,
    opacity: 0.75,
  },
  sparkleOne: {
    position: "absolute",
    top: 65,
    right: 70,
    fontSize: 32,
  },
  sparkleTwo: {
    position: "absolute",
    top: 145,
    left: 35,
    fontSize: 30,
  },
  sparkleThree: {
    position: "absolute",
    top: 245,
    right: 35,
    fontSize: 28,
  },
  sparkleFour: {
    position: "absolute",
    bottom: 95,
    left: 80,
    fontSize: 30,
  },
  sparkleFive: {
    position: "absolute",
    bottom: 210,
    right: 55,
    fontSize: 32,
  },
  sparkleSix: {
    position: "absolute",
    bottom: 300,
    left: 50,
    fontSize: 26,
  },
  loveOne: {
    position: "absolute",
    top: 95,
    left: 120,
    fontSize: 34,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#1E4D8C",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#3A6EA5",
    marginBottom: 30,
    fontWeight: "600",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderRadius: 24,
    width: "100%",
    minHeight: 245,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
  },
  quote: {
    fontSize: 22,
    lineHeight: 34,
    textAlign: "center",
    color: "#17324D",
    fontWeight: "600",
  },
  finalEmoji: {
    fontSize: 38,
    textAlign: "center",
    marginTop: 18,
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 25,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  lastPageContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  doneText: {
    fontSize: 18,
    color: "#1E4D8C",
    fontWeight: "bold",
    marginBottom: 14,
  },
  backButton: {
    backgroundColor: "#7FB3FF",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    fontSize: 15,
    color: "#3A6EA5",
    textAlign: "center",
    fontWeight: "500",
  },
});