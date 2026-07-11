import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import api from "../src/api";
import { AuthProvider, useAuth } from "../src/AuthContext";
import LoginScreen from "../src/screens/LoginScreen";
import OnboardingScreen from "../src/screens/OnboardingScreen";
import { colors } from "../src/theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppGate() {
  const { token, setToken } = useAuth();
  const [precisaOnboarding, setPrecisaOnboarding] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    if (!token) {
      setPrecisaOnboarding(null);
      return;
    }

    async function verificarPerfil() {
      try {
        const response = await api.get("/configuracoes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrecisaOnboarding(!response.data.perfil);
      } catch (error) {
        setPrecisaOnboarding(false);
      }
    }

    verificarPerfil();
  }, [token]);

  function handleLoginSuccess(novoToken: string) {
    setToken(novoToken);
  }

  if (!token) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (precisaOnboarding === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (precisaOnboarding) {
    return (
      <OnboardingScreen
        token={token}
        onConcluido={() => setPrecisaOnboarding(false)}
      />
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AppGate />
        <StatusBar style="light" />
      </ThemeProvider>
    </AuthProvider>
  );
}
