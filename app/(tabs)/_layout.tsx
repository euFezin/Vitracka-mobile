import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

function ChatTabButton(props: any) {
  return (
    <TouchableOpacity
      {...props}
      style={styles.centerWrapper}
      activeOpacity={0.85}
    >
      <View style={styles.centerButton}>
        <Ionicons name="sparkles" size={24} color="#0F172A" />
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#22C55E",
        tabBarInactiveTintColor: "#94A3B8",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "ios" ? insets.bottom - 10 : 20,
          marginHorizontal: 20,
          height: 56,
          borderRadius: 999,
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          borderWidth: 1,
          borderColor: "rgba(34, 197, 94, 0.25)",
          elevation: 0,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="refeicoes"
        options={{
          title: "Refeições",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="fork.knife" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Chat",
          tabBarButton: ChatTabButton,
        }}
      />
      <Tabs.Screen
        name="treino"
        options={{
          title: "Treino",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="dumbbell.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          href: null,
        }}
      />
      ...
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: "Config",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="gearshape.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen name="sobre" options={{ href: null }} />
      <Tabs.Screen name="funcionalidades" options={{ href: null }} />
      <Tabs.Screen name="suporte" options={{ href: null }} />
      <Tabs.Screen name="privacidade" options={{ href: null }} />
      <Tabs.Screen name="bemestar" options={{ href: null }} />
      <Tabs.Screen name="metricas" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerWrapper: {
    top: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    width: 55,
    height: 55,
    borderRadius: 29,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#22C55E",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
