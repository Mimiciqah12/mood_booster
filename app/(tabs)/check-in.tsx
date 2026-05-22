import React, { useMemo, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type MoodKey = "sad" | "tired" | "overthinking" | "okay" | "hopeful";

type Mood = {
  key: MoodKey;
  emoji: string;
  label: string;
};

const RECIPIENT_EMAIL = "nurfaqihah1205@gmail.com";

const MOODS: Mood[] = [
  { key: "sad", emoji: "🥺", label: "Sad" },
  { key: "tired", emoji: "😮‍💨", label: "Tired" },
  { key: "overthinking", emoji: "🌀", label: "Overthinking" },
  { key: "okay", emoji: "🌸", label: "Okay" },
  { key: "hopeful", emoji: "🌤️", label: "Hopeful" },
];

const SOFT_RESPONSES: Record<MoodKey, string> = {
  sad: "Luahkan perlahan-lahan. Sedih itu berat, tapi awak tak perlu simpan seorang diri.",
  tired: "Tulis apa yang penatkan hati awak. Rehat dan jujur dengan rasa sendiri itu okay.",
  overthinking: "Keluarkan semua fikiran yang berserabut. Satu demi satu, tak perlu sempurna.",
  okay: "Kalau hari ini okay pun, awak tetap boleh cerita. Small feelings matter too.",
  hopeful: "Simpan harapan itu indah. Ceritakan apa yang awak sedang doakan.",
};

function buildMailtoUrl({
  mood,
  message,
}: {
  mood: Mood;
  message: string;
}): string {
  const subject = `Mood Care Luahan - ${mood.label}`;
  const body = [
    "Assalamualaikum,",
    "",
    `Mood: ${mood.emoji} ${mood.label}`,
    "",
    "Luahan:",
    message.trim(),
    "",
    "Sent from Happy App Mood Care Space.",
  ].join("\n");

  return `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function CheckInScreen(): React.JSX.Element {
  const [selectedMood, setSelectedMood] = useState<MoodKey>("sad");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [showCalmPopup, setShowCalmPopup] = useState<boolean>(false);

  const currentMood = useMemo(
    () => MOODS.find((mood) => mood.key === selectedMood) ?? MOODS[0],
    [selectedMood]
  );

  const canSend = message.trim().length >= 3;

  const sendLuahan = async (): Promise<void> => {
    if (!canSend) {
      setStatus("Tulis luahan sikit dulu, at least beberapa perkataan.");
      return;
    }

    const mailtoUrl = buildMailtoUrl({
      mood: currentMood,
      message,
    });

    try {
      await Linking.openURL(mailtoUrl);
      setShowCalmPopup(true);
      setStatus("");
    } catch {
      setShowCalmPopup(true);
      setStatus("");
    }
  };

  return (
    <ScrollView contentContainerStyle={moodStyles.page} showsVerticalScrollIndicator={false}>
      <Text style={moodStyles.title}>Mood Care Space</Text>
      <Text style={moodStyles.subtitle}>
        Kalau sesuatu rasa berat tapi awak tak nak bagitahu orang lain, awak
        boleh luah di sini perlahan-lahan.
      </Text>

      <View style={moodStyles.card}>
        <Text style={moodStyles.sectionTitle}>How are you feeling?</Text>
        <View style={moodStyles.moodGrid}>
          {MOODS.map((mood) => {
            const active = mood.key === selectedMood;

            return (
              <Pressable
                key={mood.key}
                onPress={() => setSelectedMood(mood.key)}
                style={({ pressed }) => [
                  moodStyles.moodCard,
                  active && moodStyles.moodCardActive,
                  pressed && moodStyles.pressed,
                ]}
              >
                <Text style={moodStyles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[moodStyles.moodLabel, active && moodStyles.moodLabelActive]}>
                  {mood.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={moodStyles.softBubble}>
          <Text style={moodStyles.softBubbleText}>{SOFT_RESPONSES[selectedMood]}</Text>
        </View>

        <Text style={moodStyles.inputLabel}>Luahan</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Tulis apa-apa yang awak rasa di sini..."
          placeholderTextColor="#A58CAC"
          multiline
          textAlignVertical="top"
          style={moodStyles.messageInput}
        />

        <Pressable
          onPress={sendLuahan}
          style={({ pressed }) => [
            moodStyles.primaryButton,
            !canSend && moodStyles.disabledButton,
            pressed && moodStyles.pressed,
          ]}
        >
          <Text style={moodStyles.primaryButtonText}>Send luahan</Text>
        </Pressable>

        {!!status && <Text style={moodStyles.statusText}>{status}</Text>}
      </View>

      <View style={moodStyles.noteCard}>
        <Text style={moodStyles.noteTitle}>Tiny reminder</Text>
        <Text style={moodStyles.noteText}>
          Kalau rasa terlalu berat atau tak selamat, please cari orang yang dipercayai
          atau bantuan segera. Awak penting.
        </Text>
      </View>

      <Modal
        visible={showCalmPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalmPopup(false)}
      >
        <View style={moodStyles.modalBackdrop}>
          <View style={moodStyles.popupCard}>
            <Text style={moodStyles.popupTitle}>Terima kasih sebab bertahan</Text>
            <Text style={moodStyles.popupText}>
              Awak dah lepaskan sedikit beban dari hati. Tarik nafas perlahan-lahan.
              Apa yang awak rasa itu valid, dan awak tak perlu hadap semuanya seorang diri.
            </Text>
            <Text style={moodStyles.popupText}>
              Teruskan hidup, walaupun perlahan. Allah nampak usaha awak, walaupun
              orang lain tak nampak.
            </Text>
            <Pressable
              onPress={() => setShowCalmPopup(false)}
              style={({ pressed }) => [moodStyles.popupButton, pressed && moodStyles.pressed]}
            >
              <Text style={moodStyles.popupButtonText}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const moodStyles = StyleSheet.create({
  page: {
    padding: 20,
    paddingBottom: 34,
    backgroundColor: "#FFF7FC",
    gap: 14,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    color: "#2E163B",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6E5D77",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F3DDF4",
    shadowColor: "#AE7CFF",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#351F45",
    textAlign: "center",
  },
  moodGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  moodCard: {
    flexGrow: 1,
    minWidth: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EADAF3",
  },
  moodCardActive: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#4B2E63",
  },
  moodLabelActive: {
    color: "#FFFFFF",
  },
  softBubble: {
    marginTop: 16,
    backgroundColor: "#F2EAFF",
    borderRadius: 22,
    padding: 16,
  },
  softBubbleText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "800",
    color: "#5D4373",
    textAlign: "center",
  },
  inputLabel: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "900",
    color: "#4B2E63",
  },
  input: {
    backgroundColor: "#FFF8FC",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EADAF3",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#2E163B",
  },
  messageInput: {
    minHeight: 180,
    backgroundColor: "#FFF8FC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EADAF3",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    lineHeight: 24,
    color: "#2E163B",
  },
  primaryButton: {
    marginTop: 18,
    alignItems: "center",
    backgroundColor: "#7C3AED",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 18,
  },
  disabledButton: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  statusText: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "800",
    color: "#6E5D77",
    textAlign: "center",
  },
  noteCard: {
    backgroundColor: "#EAF7FF",
    borderRadius: 28,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D7ECF8",
    shadowColor: "#2D5E79",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#2D5E79",
    marginBottom: 8,
    textAlign: "center",
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#557286",
    textAlign: "center",
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
  popupText: {
    marginTop: 14,
    fontSize: 17,
    lineHeight: 27,
    fontWeight: "700",
    color: "#594438",
    textAlign: "center",
  },
  popupButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#7C3AED",
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  popupButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.98 }],
  },
});
