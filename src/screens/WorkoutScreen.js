import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../api";
import { colors, radius, spacing, typography } from "../theme";

export default function WorkoutScreen({ token }) {
  const [conteudo, setConteudo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();

  const carregarTreino = useCallback(async () => {
    try {
      const response = await api.get("/treino", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConteudo(response.data.conteudo);
      setErro(false);
    } catch (error) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      carregarTreino();
    }, [carregarTreino]),
  );

  async function gerarNovoTreino() {
    setGerando(true);
    try {
      const response = await api.post(
        "/treino/gerar",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setConteudo(response.data.conteudo);
      setErro(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível gerar o treino.");
    } finally {
      setGerando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const blocos = conteudo ? conteudo.split("\n\n") : [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom:
          Platform.OS === "ios" ? tabBarHeight + 50 : tabBarHeight + 100,
      }}
    >
      <Text style={styles.titulo}>Seu treino</Text>

      {erro || !conteudo ? (
        <Text style={styles.texto}>Nenhum treino encontrado ainda.</Text>
      ) : (
        blocos.map((bloco, index) => {
          const linhas = bloco.split("\n");
          const dia = linhas[0];
          const exercicios = linhas.slice(1);

          return (
            <View key={index} style={styles.card}>
              <Text style={styles.dia}>{dia}</Text>
              {exercicios.map((linha, i) => (
                <View key={i} style={styles.linhaExercicio}>
                  <Ionicons
                    name="barbell-outline"
                    size={14}
                    color={colors.primary}
                    style={{ marginRight: spacing.sm }}
                  />
                  <Text style={styles.linha}>{linha}</Text>
                </View>
              ))}
            </View>
          );
        })
      )}

      <TouchableOpacity
        style={styles.botao}
        onPress={gerarNovoTreino}
        disabled={gerando}
      >
        <Text style={styles.botaoTexto}>
          {gerando ? "Gerando..." : "Gerar novo treino"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingTop: 60,
  },
  titulo: { ...typography.titulo, fontSize: 24, marginBottom: spacing.xl },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  dia: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  linhaExercicio: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
  linha: { color: colors.text, fontSize: 14, lineHeight: 20, flex: 1 },
  texto: { color: colors.text, marginBottom: spacing.xl },
  botao: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: radius.button,
    marginTop: spacing.sm,
  },
  botaoTexto: {
    color: colors.background,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
