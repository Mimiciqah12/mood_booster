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

  const quotes = [
    "Allah tidak pernah silap dalam mengatur hidup awak. Yakinlah, setiap yang berlaku pasti ada hikmahnya.",
    "Sabar dan tenang tau, apa yang ditakdirkan untuk awak pasti akan sampai kepada awak pada waktu yang tepat.",
    "Jangan terlalu risau. Allah tahu apa yang terbaik untuk awak.",
    "Kadang Allah tangguhkan sesuatu kerana Dia mahu beri yang lebih baik.",
    "Senyumlah cikit oceyyy. Awak sedang dijaga oleh Allah dalam cara yang awak belum nampak.",
    "Percaya pada takdir Allah. Setiap ujian pasti ada ganjarannya.",
    "Hari ini mungkin berat, tapi Allah tidak akan membebani hamba-Nya melebihi kemampuan.",
    "Semoga Amir diberikan kebahagiaan yang melimpah dan selalu dikelilingi orang yang baik.",
    "Semoga lab dan FYP Amir dipermudahkan dan mendapat hasil yang memuaskan.",
    "Jangan sedih lama-lama. Awak kuat, awak mampu, dan Allah sentiasa ada.",
    "Semoga Amir tak kene marah dengan lecturer todayyy",
  ];

  const [quote, setQuote] = useState(
    "Assalamualaikum, Amir Zafran. Semoga hari ini dipenuhi senyuman dan ketenangan ✨"
  );

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
          toValue: 20,
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

  const nextQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);

    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.08,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.sparkleOne, { transform: [{ translateY: float1 }] }]}>
        ✦
      </Animated.Text>

      <Animated.Text style={[styles.sparkleTwo, { transform: [{ translateY: float2 }] }]}>
        ✨
      </Animated.Text>

      <Animated.Text style={[styles.sparkleThree, { transform: [{ translateY: float1 }] }]}>
        ❈
      </Animated.Text>

      <Animated.Text style={[styles.sparkleFour, { transform: [{ translateY: float2 }] }]}>
        ⭐
      </Animated.Text>

      <Animated.Text style={[styles.loveOne, { transform: [{ translateY: float1 }] }]}>
        💙
      </Animated.Text>

      <Text style={styles.title}>Hi, Amir</Text>
      <Text style={styles.subtitle}>Always be happy & senyum selalu oceyyy 🤍</Text>

      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Text style={styles.quote}>“{quote}”</Text>
      </Animated.View>

      <TouchableOpacity style={styles.button} onPress={nextQuote}>
        <Text style={styles.buttonText}> seterusnya ⭐</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Ingat, Allah sentiasa ada bersama awak.</Text>
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
  },
  sparkleOne: {
    position: "absolute",
    top: 80,
    right: 80,
    fontSize: 30,
  },
  sparkleTwo: {
    position: "absolute",
    top: 220,
    left: 35,
    fontSize: 28,
  },
  sparkleThree: {
    position: "absolute",
    bottom: 230,
    right: 40,
    fontSize: 30,
  },
  sparkleFour: {
    position: "absolute",
    bottom: 90,
    left: 90,
    fontSize: 30,
  },
  loveOne: {
    position: "absolute",
    top: 145,
    right: 40,
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
    minHeight: 230,
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
  footer: {
    fontSize: 15,
    color: "#3A6EA5",
    textAlign: "center",
    fontWeight: "500",
  },
});