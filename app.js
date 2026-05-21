import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const messages = [
    "You are doing great today 🌸",
    "Jangan sedih, you are stronger than you think 💪",
    "Someone is proud of you 🤍",
    "Smile sikit, comel lah tu 😆",
    "Hari ni mungkin susah, tapi esok boleh jadi lebih baik 🌈",
    "You deserve happiness and peace ✨",
    "Take a deep breath. Everything will be okay 🫶"
  ];

  const [message, setMessage] = useState("Tekan button untuk happy 💖");

  const makeHappy = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMessage(messages[randomIndex]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Happy Button</Text>

      <View style={styles.card}>
        <Text style={styles.message}>{message}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={makeHappy}>
        <Text style={styles.buttonText}>Make Me Happy 😄</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE6F0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#D63384",
  },
  card: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    marginBottom: 30,
    width: "100%",
    elevation: 5,
  },
  message: {
    fontSize: 22,
    textAlign: "center",
    color: "#333",
  },
  button: {
    backgroundColor: "#FF69B4",
    padding: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});