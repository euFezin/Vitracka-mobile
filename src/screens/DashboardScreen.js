import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../api";
import { colors, radius, spacing, typography } from "../theme";

export default function DashboardScreen({ token }) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  const [nomeUsuario, setNomeUsuario] = useState("");

  const carregarDashboard = useCallback(async () => {
    try {
      const [dashboardRes, configRes] = await Promise.all([
        api.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/configuracoes", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setDados(dashboardRes.data);
      setNomeUsuario(configRes.data.usuario.nome.split(" ")[0]);
      setErro(false);
    } catch (error) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      carregarDashboard();
    }, [carregarDashboard]),
  );

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
        <Text style={styles.texto}>Erro ao carregar dashboard.</Text>
      </View>
    );
  }

  const progresso = Math.max(0, Math.min(dados.progresso ?? 0, 100));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: tabBarHeight + 40 }}
    >
      <View style={styles.header}>
        <Text style={styles.titulo}>Seu progresso</Text>
        <TouchableOpacity onPress={() => router.push("/configuracoes")}>
          <Ionicons name="settings-sharp" size={24} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.titulo}>Olá, {nomeUsuario} 👋</Text>
        <TouchableOpacity
          style={styles.botaoCheckin}
          onPress={() => router.push("/checkin")}
        >
          <Text style={styles.botaoCheckinTexto}>+ Novo check-in</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.linhaCards}>
        <View style={[styles.card, styles.cardMetade]}>
          <Text style={styles.label}>Objetivo</Text>
          <Text style={styles.valor}>{dados.objetivo ?? "-"}</Text>
        </View>

        <View style={[styles.card, styles.cardMetade]}>
          <Text style={styles.label}>Streak</Text>
          <Text style={styles.valor}>{dados.streak ?? 0} dias</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Peso atual</Text>
        <Text style={styles.valor}>{dados.peso_atual ?? "-"} kg</Text>

        <View style={styles.progressBarFundo}>
          <View
            style={[styles.progressBarPreenchido, { width: `${progresso}%` }]}
          />
        </View>
        <Text style={styles.progressoTexto}>
          {progresso.toFixed(0)}% da meta
        </Text>
      </View>

      {dados.plano && (
        <View style={styles.calorieBox}>
          <Text style={styles.calorieLabel}>{dados.plano.nome}</Text>
          <Text style={styles.calorieValor}>{dados.plano.calorias} kcal</Text>

          <View style={styles.macroGrid}>
            <View style={styles.macroBox}>
              <Text style={styles.macroValor}>{dados.plano.proteina}g</Text>
              <Text style={styles.macroLabel}>Proteína</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroValor}>{dados.plano.carboidratos}g</Text>
              <Text style={styles.macroLabel}>Carboidratos</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroValor}>{dados.plano.gordura}g</Text>
              <Text style={styles.macroLabel}>Gordura</Text>
            </View>
          </View>
        </View>
      )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  titulo: { ...typography.titulo, fontSize: 26 },
  linhaCards: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  cardMetade: { flex: 1, marginBottom: 0 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  label: { color: colors.textMuted, fontSize: 13, marginBottom: 4 },
  valor: { color: colors.text, fontSize: 20, fontWeight: "bold" },
  progressBarFundo: {
    width: "100%",
    height: 10,
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    overflow: "hidden",
    marginTop: spacing.md,
  },
  progressBarPreenchido: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  progressoTexto: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  calorieBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.card - 2,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  calorieLabel: { color: colors.textMuted, fontSize: 13, marginBottom: 4 },
  calorieValor: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: spacing.lg,
  },
  macroGrid: { flexDirection: "row", gap: spacing.md },
  macroBox: {
    flex: 1,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.button,
    alignItems: "center",
  },
  macroValor: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  macroLabel: { color: colors.textMuted, fontSize: 12 },
  texto: { color: colors.text },
  saudacaoFrase: { color: colors.textMuted, fontSize: 14, marginBottom: 2 },
  botaoCheckin: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    padding: spacing.md,
    borderRadius: radius.button,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  botaoCheckinTexto: { color: colors.primary, fontWeight: "bold" },
});
