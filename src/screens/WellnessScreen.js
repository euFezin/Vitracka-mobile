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
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../api";
import { colors, radius, spacing } from "../theme";

const METAS = { agua_ml: 3000 };

export default function WellnessScreen({ token }) {
  const [hoje, setHoje] = useState(null);
  const [medias, setMedias] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [sonoInput, setSonoInput] = useState("");
  const [salvandoSono, setSalvandoSono] = useState(false);
  const [atualizandoAgua, setAtualizandoAgua] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();

  const carregarTudo = useCallback(async () => {
    try {
      const [hojeRes, historicoRes] = await Promise.all([
        api.get("/tracker/hoje", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/tracker/historico", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setHoje(hojeRes.data);
      setMedias(historicoRes.data.medias);
      setSonoInput(
        hojeRes.data.sono_horas ? String(hojeRes.data.sono_horas) : "",
      );
    } catch (error) {
      // silencioso
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      carregarTudo();
    }, [carregarTudo]),
  );

  async function ajustarAgua(delta) {
    if (!hoje) return;
    const novoValor = Math.max(0, hoje.agua_ml + delta);
    setAtualizandoAgua(true);
    setHoje((atual) => ({ ...atual, agua_ml: novoValor }));

    try {
      await api.put(
        "/tracker/agua",
        { agua_ml: novoValor },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a água.");
    } finally {
      setAtualizandoAgua(false);
    }
  }

  async function salvarSono() {
    if (!sonoInput) {
      Alert.alert("Atenção", "Informe as horas de sono.");
      return;
    }

    setSalvandoSono(true);
    try {
      const response = await api.put(
        "/tracker/sono",
        { sono_horas: parseFloat(sonoInput.replace(",", ".")) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setHoje((atual) => ({ ...atual, sono_horas: response.data.sono_horas }));
      carregarTudo();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o sono.");
    } finally {
      setSalvandoSono(false);
    }
  }

  if (carregando || !hoje) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const progressoAgua = Math.min((hoje.agua_ml / METAS.agua_ml) * 100, 100);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom:
          Platform.OS === "ios" ? tabBarHeight + 40 : tabBarHeight + 70,
      }}
    >
      <Text style={styles.titulo}>Bem-estar</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="water" size={20} color={colors.primary} />
          <Text style={styles.cardLabel}>Água hoje</Text>
        </View>

        <Text style={styles.aguaValor}>{hoje.agua_ml} ml</Text>
        <Text style={styles.aguaMeta}>Meta: {METAS.agua_ml} ml</Text>

        <View style={styles.progressBarFundo}>
          <View
            style={[
              styles.progressBarPreenchido,
              { width: `${progressoAgua}%` },
            ]}
          />
        </View>

        <View style={styles.botoesAgua}>
          <TouchableOpacity
            style={styles.botaoAgua}
            onPress={() => ajustarAgua(250)}
            disabled={atualizandoAgua}
          >
            <Text style={styles.botaoAguaTexto}>+250ml</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoAgua}
            onPress={() => ajustarAgua(500)}
            disabled={atualizandoAgua}
          >
            <Text style={styles.botaoAguaTexto}>+500ml</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoAguaReset}
            onPress={() => ajustarAgua(-hoje.agua_ml)}
            disabled={atualizandoAgua}
          >
            <Ionicons name="refresh" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="moon" size={20} color={colors.primary} />
          <Text style={styles.cardLabel}>Sono de hoje</Text>
        </View>

        <View style={styles.sonoLinha}>
          <TextInput
            style={styles.sonoInput}
            placeholder="Horas dormidas"
            placeholderTextColor={colors.textMuted}
            value={sonoInput}
            onChangeText={setSonoInput}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity
            style={styles.botaoSalvarSono}
            onPress={salvarSono}
            disabled={salvandoSono}
          >
            <Text style={styles.botaoSalvarSonoTexto}>
              {salvandoSono ? "..." : "Salvar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {medias && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Médias</Text>

          <View style={styles.mediaLinha}>
            <Text style={styles.mediaTitulo}>Água</Text>
            <Text style={styles.mediaValor}>
              Diária: {medias.agua_ml.diaria ?? "-"} ml
            </Text>
            <Text style={styles.mediaValor}>
              Semanal: {medias.agua_ml.semanal ?? "-"} ml
            </Text>
            <Text style={styles.mediaValor}>
              Mensal: {medias.agua_ml.mensal ?? "-"} ml
            </Text>
          </View>

          <View style={styles.mediaLinha}>
            <Text style={styles.mediaTitulo}>Sono</Text>
            <Text style={styles.mediaValor}>
              Diária: {medias.sono_horas.diaria ?? "-"} h
            </Text>
            <Text style={styles.mediaValor}>
              Semanal: {medias.sono_horas.semanal ?? "-"} h
            </Text>
            <Text style={styles.mediaValor}>
              Mensal: {medias.sono_horas.mensal ?? "-"} h
            </Text>
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
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardLabel: { color: colors.text, fontSize: 15, fontWeight: "bold" },
  aguaValor: { color: colors.text, fontSize: 28, fontWeight: "bold" },
  aguaMeta: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.md },
  progressBarFundo: {
    width: "100%",
    height: 10,
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  progressBarPreenchido: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  botoesAgua: { flexDirection: "row", gap: spacing.sm },
  botaoAgua: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radius.button,
    alignItems: "center",
  },
  botaoAguaTexto: { color: colors.primary, fontWeight: "bold" },
  botaoAguaReset: {
    width: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radius.button,
  },
  sonoLinha: { flexDirection: "row", gap: spacing.sm },
  sonoInput: {
    flex: 1,
    backgroundColor: colors.background,
    color: colors.text,
    padding: 14,
    borderRadius: radius.input,
  },
  botaoSalvarSono: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    borderRadius: radius.button,
  },
  botaoSalvarSonoTexto: { color: colors.background, fontWeight: "bold" },
  mediaLinha: { marginBottom: spacing.md },
  mediaTitulo: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  mediaValor: { color: colors.textMuted, fontSize: 13 },
});
