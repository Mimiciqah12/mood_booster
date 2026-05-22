import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type CategoryKey = "calm" | "patience" | "hope" | "hadith";

type Category = {
  key: CategoryKey;
  label: string;
  caption: string;
};

type Quote = {
  category: CategoryKey;
  title: string;
  text: string;
  source: string;
  type: "Maksud ayat Al-Quran" | "Ringkasan hadis sahih";
};

const CATEGORIES: Category[] = [
  {
    key: "calm",
    label: "Tenang",
    caption: "Untuk hati yang rasa berat dan perlukan damai.",
  },
  {
    key: "patience",
    label: "Sabar",
    caption: "Untuk terus kuat walaupun hari terasa susah.",
  },
  {
    key: "hope",
    label: "Harapan",
    caption: "Untuk ingat bahawa rahmat Allah sentiasa luas.",
  },
  {
    key: "hadith",
    label: "Hadis",
    caption: "Pesanan Rasulullah SAW yang melembutkan hati.",
  },
];

const QUOTES: Quote[] = [
  {
    category: "calm",
    title: "Hati yang mencari tenang",
    text: "Ketahuilah, dengan mengingati Allah hati menjadi tenteram.",
    source: "Surah Ar-Ra'd 13:28",
    type: "Maksud ayat Al-Quran",
  },
  {
    category: "calm",
    title: "Allah dekat",
    text: "Sesungguhnya Aku dekat. Aku kabulkan doa orang yang berdoa apabila dia berdoa kepada-Ku.",
    source: "Surah Al-Baqarah 2:186",
    type: "Maksud ayat Al-Quran",
  },
  {
    category: "calm",
    title: "Jangan takut dan sedih",
    text: "Para malaikat menenangkan orang yang teguh: jangan takut dan jangan bersedih.",
    source: "Surah Fussilat 41:30",
    type: "Maksud ayat Al-Quran",
  },
  {
    category: "patience",
    title: "Allah bersama orang sabar",
    text: "Wahai orang-orang yang beriman, mintalah pertolongan dengan sabar dan solat. Sesungguhnya Allah bersama orang-orang yang sabar.",
    source: "Surah Al-Baqarah 2:153",
    type: "Maksud ayat Al-Quran",
  },
  {
    category: "patience",
    title: "Kesulitan ada kemudahan",
    text: "Sesungguhnya bersama kesulitan ada kemudahan.",
    source: "Surah Ash-Sharh 94:5-6",
    type: "Maksud ayat Al-Quran",
  },
  {
    category: "patience",
    title: "Sesuai kemampuan",
    text: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
    source: "Surah Al-Baqarah 2:286",
    type: "Maksud ayat Al-Quran",
  },
  {
    category: "hope",
    title: "Jangan putus asa",
    text: "Janganlah kamu berputus asa daripada rahmat Allah.",
    source: "Surah Az-Zumar 39:53",
    type: "Maksud ayat Al-Quran",
  },
  {
    category: "hope",
    title: "Penghibur dari Ad-Duha",
    text: "Tuhanmu tidak meninggalkanmu dan tidak pula membencimu.",
    source: "Surah Ad-Duha 93:3",
    type: "Maksud ayat Al-Quran",
  },
  {
    category: "hope",
    title: "Jalan keluar",
    text: "Barang siapa bertakwa kepada Allah, nescaya Dia akan mengadakan baginya jalan keluar.",
    source: "Surah At-Talaq 65:2",
    type: "Maksud ayat Al-Quran",
  },
  {
    category: "hadith",
    title: "Semua urusan ada kebaikan",
    text: "Urusan seorang mukmin itu menakjubkan; nikmat disyukuri dan ujian dihadapi dengan sabar, lalu kedua-duanya menjadi kebaikan.",
    source: "Sahih Muslim 2999",
    type: "Ringkasan hadis sahih",
  },
  {
    category: "hadith",
    title: "Sedih pun ada nilai",
    text: "Keletihan, sakit, kesedihan, gangguan dan dukacita yang menimpa seorang Muslim boleh menjadi sebab Allah menghapuskan sebahagian dosanya.",
    source: "Sahih al-Bukhari 5641/5642",
    type: "Ringkasan hadis sahih",
  },
  {
    category: "hadith",
    title: "Bersangka baik kepada Allah",
    text: "Allah berfirman bahawa Dia menurut sangkaan hamba-Nya terhadap-Nya, dan Dia bersama hamba yang mengingati-Nya.",
    source: "Sahih al-Bukhari 7405",
    type: "Ringkasan hadis sahih",
  },
];

export default function QuotesScreen(): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("calm");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const currentCategory = useMemo(
    () => CATEGORIES.find((category) => category.key === selectedCategory) ?? CATEGORIES[0],
    [selectedCategory]
  );

  const filteredQuotes = useMemo(
    () => QUOTES.filter((quote) => quote.category === selectedCategory),
    [selectedCategory]
  );

  const currentQuote = filteredQuotes[selectedIndex] ?? filteredQuotes[0];

  const selectCategory = (category: CategoryKey): void => {
    setSelectedCategory(category);
    setSelectedIndex(0);
  };

  return (
    <ScrollView contentContainerStyle={quoteStyles.page} showsVerticalScrollIndicator={false}>
      <Text style={quoteStyles.title}>Quran & Hadith Comfort</Text>
      <Text style={quoteStyles.subtitle}>
        Pilih jenis reminder yang hati awak perlukan hari ini.
      </Text>

      <View style={quoteStyles.categoryRow}>
        {CATEGORIES.map((category) => {
          const active = category.key === selectedCategory;

          return (
            <Pressable
              key={category.key}
              onPress={() => selectCategory(category.key)}
              style={({ pressed }) => [
                quoteStyles.categoryChip,
                active && quoteStyles.categoryChipActive,
                pressed && quoteStyles.pressed,
              ]}
            >
              <Text
                style={[
                  quoteStyles.categoryChipText,
                  active && quoteStyles.categoryChipTextActive,
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={quoteStyles.heroCard}>
        <Text style={quoteStyles.categoryCaption}>{currentCategory.caption}</Text>
        <Text style={quoteStyles.sourceType}>{currentQuote.type}</Text>
        <Text style={quoteStyles.quoteTitle}>{currentQuote.title}</Text>
        <Text style={quoteStyles.quoteText}>{`"${currentQuote.text}"`}</Text>
        <Text style={quoteStyles.quoteSource}>{currentQuote.source}</Text>

        <View style={quoteStyles.buttonRow}>
          <Pressable
            onPress={() =>
              setSelectedIndex((prev) => (prev - 1 + filteredQuotes.length) % filteredQuotes.length)
            }
            style={({ pressed }) => [quoteStyles.secondaryButton, pressed && quoteStyles.pressed]}
          >
            <Text style={quoteStyles.secondaryButtonText}>Previous</Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedIndex((prev) => (prev + 1) % filteredQuotes.length)}
            style={({ pressed }) => [quoteStyles.primaryButton, pressed && quoteStyles.pressed]}
          >
            <Text style={quoteStyles.primaryButtonText}>Next</Text>
          </Pressable>
        </View>
      </View>

      <View style={quoteStyles.listCard}>
        <Text style={quoteStyles.listTitle}>Choose a reminder</Text>
        {filteredQuotes.map((item, itemIndex) => (
          <Pressable
            key={`${item.source}-${itemIndex}`}
            onPress={() => setSelectedIndex(itemIndex)}
            style={({ pressed }) => [
              quoteStyles.smallCard,
              itemIndex === selectedIndex && quoteStyles.smallCardActive,
              pressed && quoteStyles.pressed,
            ]}
          >
            <View style={quoteStyles.smallCardTop}>
              <Text style={quoteStyles.smallCardTitle}>{item.title}</Text>
              <Text style={quoteStyles.smallCardSource}>{item.source}</Text>
            </View>
            <Text style={quoteStyles.smallCardText}>{item.text}</Text>
          </Pressable>
        ))}
      </View>

      <View style={quoteStyles.noteCard}>
        <Text style={quoteStyles.noteText}>
          Nota: Teks di sini ialah maksud/ringkasan untuk bacaan ringkas. Rujukan
          surah dan nombor hadis disertakan supaya boleh disemak semula.
        </Text>
      </View>
    </ScrollView>
  );
}

const quoteStyles = StyleSheet.create({
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
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  categoryChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#EADAF3",
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  categoryChipActive: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#4A2F56",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  heroCard: {
    backgroundColor: "#F2EAFF",
    borderRadius: 32,
    padding: 22,
    borderWidth: 1,
    borderColor: "#EADAF3",
    shadowColor: "#7C3AED",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  categoryCaption: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "800",
    color: "#6D5A79",
    textAlign: "center",
    marginBottom: 14,
  },
  sourceType: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    color: "#7047C7",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },
  quoteTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#321E43",
    textAlign: "center",
  },
  quoteText: {
    marginTop: 12,
    fontSize: 27,
    lineHeight: 38,
    fontWeight: "900",
    color: "#4B2E63",
    textAlign: "center",
  },
  quoteSource: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "800",
    color: "#766786",
    textAlign: "center",
  },
  buttonRow: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 18,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 18,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  secondaryButtonText: {
    color: "#4A2F56",
    fontWeight: "900",
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3DDF4",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#351F45",
    textAlign: "center",
    marginBottom: 12,
  },
  smallCard: {
    backgroundColor: "#FFF8FC",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3DDF4",
    marginBottom: 10,
  },
  smallCardActive: {
    backgroundColor: "#FFEAF4",
    borderColor: "#F3B9D7",
  },
  smallCardTop: {
    gap: 6,
  },
  smallCardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#4A2F56",
  },
  smallCardSource: {
    fontSize: 12,
    fontWeight: "900",
    color: "#8D5E9F",
    textTransform: "uppercase",
  },
  smallCardText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#6E5D77",
  },
  noteCard: {
    backgroundColor: "#EAF7FF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D7ECF8",
  },
  noteText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    color: "#557286",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.98 }],
  },
});
