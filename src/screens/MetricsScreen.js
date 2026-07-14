import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../api";
import { colors, radius, spacing } from "../theme";

export default function MetricsScreen({ token }) {
  const [historico, setHistorico] = useState([]);
  const [medias, setMedias] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  const carregar = useCallback(async () => {
    try {
      const response = await api.get("/tracker/historico", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistorico(response.data.historico);
      setMedias(response.data.medias);
    } catch (error) {
      // silencioso
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom:
          Platform.OS === "ios" ? tabBarHeight + 40 : tabBarHeight + 70,
      }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.titulo}>Suas métricas</Text>
      </View>

      {medias && (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>💧 Água</Text>
            <View style={styles.linhaMedias}>
              <View style={styles.itemMedia}>
                <Text style={styles.label}>Diária</Text>
                <Text style={styles.valor}>
                  {medias.agua_ml.diaria ?? "--"} ml
                </Text>
              </View>
              <View style={styles.itemMedia}>
                <Text style={styles.label}>Semanal</Text>
                <Text style={styles.valor}>
                  {medias.agua_ml.semanal ?? "--"} ml
                </Text>
              </View>
              <View style={styles.itemMedia}>
                <Text style={styles.label}>Mensal</Text>
                <Text style={styles.valor}>
                  {medias.agua_ml.mensal ?? "--"} ml
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>🌙 Sono</Text>
            <View style={styles.linhaMedias}>
              <View style={styles.itemMedia}>
                <Text style={styles.label}>Diária</Text>
                <Text style={styles.valor}>
                  {medias.sono_horas.diaria ?? "--"} h
                </Text>
              </View>
              <View style={styles.itemMedia}>
                <Text style={styles.label}>Semanal</Text>
                <Text style={styles.valor}>
                  {medias.sono_horas.semanal ?? "--"} h
                </Text>
              </View>
              <View style={styles.itemMedia}>
                <Text style={styles.label}>Mensal</Text>
                <Text style={styles.valor}>
                  {medias.sono_horas.mensal ?? "--"} h
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Histórico (últimos 30 dias)</Text>

        {historico.length === 0 ? (
          <Text style={styles.textoVazio}>
            Ainda não há registros de água ou sono.
          </Text>
        ) : (
          historico.map((item, index) => (
            <View key={index} style={styles.itemHistorico}>
              <Text style={styles.dataHistorico}>
                {new Date(item.data + "T00:00:00").toLocaleDateString("pt-BR")}
              </Text>
              <Text style={styles.detalheHistorico}>
                💧 {item.agua_ml} ml
                {item.sono_horas ? ` · 🌙 ${item.sono_horas} h` : ""}
              </Text>
            </View>
          ))
        )}
      </View>
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
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  titulo: { fontSize: 22, fontWeight: "bold", color: colors.text },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitulo: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  linhaMedias: { flexDirection: "row", justifyContent: "space-between" },
  itemMedia: { flex: 1 },
  label: { color: colors.textMuted, fontSize: 12, marginBottom: 2 },
  valor: { color: colors.text, fontSize: 16, fontWeight: "bold" },
  textoVazio: { color: colors.textMuted, fontSize: 13 },
  itemHistorico: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  dataHistorico: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  detalheHistorico: { color: colors.textMuted, fontSize: 13 },
});
