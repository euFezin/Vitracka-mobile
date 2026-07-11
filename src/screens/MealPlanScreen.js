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

export default function MealPlanScreen({ token }) {
  const [dados, setDados] = useState(null);
  const [explicacao, setExplicacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [regenerando, setRegenerando] = useState(null);
  const tabBarHeight = useBottomTabBarHeight();

  const carregarTudo = useCallback(async () => {
    try {
      const [refeicoesRes, explicacaoRes] = await Promise.all([
        api.get("/refeicoes", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/explicacao", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setDados(refeicoesRes.data);
      setExplicacao(explicacaoRes.data.explicacao);
      setErro(false);
    } catch (error) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      carregarTudo();
    }, [carregarTudo]),
  );

  async function regenerarRefeicao(nome) {
    setRegenerando(nome);
    try {
      const response = await api.post(
        "/refeicoes/regenerar",
        { refeicao: nome },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setDados((atual) => ({
        ...atual,
        refeicoes: { ...atual.refeicoes, [nome]: response.data.conteudo },
      }));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível regenerar essa refeição.");
    } finally {
      setRegenerando(null);
    }
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (erro || !dados) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Nenhum plano alimentar encontrado.</Text>
      </View>
    );
  }

  const nomesRefeicoes = Object.keys(dados.refeicoes || {});

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom:
          Platform.OS === "ios" ? tabBarHeight + 40 : tabBarHeight + 80,
      }}
    >
      <Text style={styles.titulo}>{dados.plano?.nome}</Text>

      <View style={styles.resumo}>
        <Text style={styles.resumoTexto}>{dados.plano?.calorias} kcal</Text>
        <Text style={styles.resumoMacro}>
          P: {dados.plano?.proteina}g · C: {dados.plano?.carboidratos}g · G:{" "}
          {dados.plano?.gordura}g
        </Text>
      </View>

      {explicacao && (
        <View style={styles.cardExplicacao}>
          <Text style={styles.labelExplicacao}>Por que esse plano?</Text>
          <Text style={styles.textoExplicacao}>{explicacao}</Text>
        </View>
      )}

      {nomesRefeicoes.map((nome) => (
        <View key={nome} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.nomeRefeicao}>{nome}</Text>
            <TouchableOpacity
              onPress={() => regenerarRefeicao(nome)}
              disabled={regenerando === nome}
              style={styles.botaoRegenerar}
            >
              {regenerando === nome ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="refresh" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.conteudoRefeicao}>{dados.refeicoes[nome]}</Text>
        </View>
      ))}
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
  titulo: { ...typography.titulo, fontSize: 24, marginBottom: spacing.xs },
  resumo: { marginBottom: spacing.lg },
  resumoTexto: { color: colors.text, fontSize: 18, fontWeight: "bold" },
  resumoMacro: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  cardExplicacao: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.card - 2,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  labelExplicacao: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  textoExplicacao: { color: colors.text, fontSize: 14, lineHeight: 20 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  nomeRefeicao: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  botaoRegenerar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  conteudoRefeicao: { color: colors.text, fontSize: 14, lineHeight: 20 },
  texto: { color: colors.text },
});
