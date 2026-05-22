import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

function TabIcon({ emoji }: { emoji: string }): React.JSX.Element {
  return <Text style={{ fontSize: 18 }}>{emoji}</Text>;
}

export default function TabsLayout(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "#7B7280",
        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: "#FFF8FE",
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <TabIcon emoji="🌈" />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: "Games",
          tabBarIcon: () => <TabIcon emoji="🎠" />,
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: "Quotes",
          tabBarIcon: () => <TabIcon emoji="💜" />,
        }}
      />
      <Tabs.Screen
        name="check-in"
        options={{
          title: "Mood",
          tabBarIcon: () => <TabIcon emoji="🫶" />,
        }}
      />
    </Tabs>
  );
}