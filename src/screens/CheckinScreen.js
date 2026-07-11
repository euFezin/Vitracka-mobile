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
import { colors, radius, spacing, typography } from "../theme";

export default function CheckinScreen({ token }) {
  const [checkins, setCheckins] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();

  const [peso, setPeso] = useState("");
  const [cintura, setCintura] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const carregarCheckins = useCallback(async () => {
    try {
      const response = await api.get("/checkins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCheckins(response.data.checkins);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o histórico.");
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      carregarCheckins();
    }, [carregarCheckins]),
  );

  async function enviarCheckin() {
    if (!peso) {
      Alert.alert("Atenção", "Informe o peso.");
      return;
    }

    setEnviando(true);

    try {
      await api.post(
        "/checkins",
        {
          peso: parseFloat(peso.replace(",", ".")),
          cintura: cintura ? parseFloat(cintura.replace(",", ".")) : null,
          observacoes: observacoes.trim() || null,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setPeso("");
      setCintura("");
      setObservacoes("");
      carregarCheckins();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o check-in.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom:
          Platform.OS === "ios" ? tabBarHeight + 50 : tabBarHeight + 100,
      }}
    >
      <Text style={styles.titulo}>Novo check-in</Text>

      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        placeholderTextColor={colors.textMuted}
        value={peso}
        onChangeText={setPeso}
        keyboardType="decimal-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Cintura (cm) - opcional"
        placeholderTextColor={colors.textMuted}
        value={cintura}
        onChangeText={setCintura}
        keyboardType="decimal-pad"
      />

      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Observações - opcional"
        placeholderTextColor={colors.textMuted}
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={enviarCheckin}
        disabled={enviando}
      >
        <Text style={styles.botaoTexto}>
          {enviando ? "Salvando..." : "Salvar check-in"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subtitulo}>Histórico</Text>

      {carregando ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        checkins.map((c) => (
          <View key={c.id} style={styles.card}>
            <Text style={styles.cardPeso}>{c.peso} kg</Text>
            {c.cintura && (
              <Text style={styles.cardDetalhe}>Cintura: {c.cintura} cm</Text>
            )}
            {c.observacoes && (
              <Text style={styles.cardDetalhe}>{c.observacoes}</Text>
            )}
            <Text style={styles.cardData}>
              {new Date(c.data).toLocaleDateString("pt-BR")}
            </Text>
          </View>
        ))
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
  titulo: { ...typography.titulo, fontSize: 24, marginBottom: spacing.lg },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    padding: 16,
    borderRadius: radius.input,
    marginBottom: spacing.md,
  },
  inputMultiline: { minHeight: 60, textAlignVertical: "top" },
  botao: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: radius.button,
    marginTop: spacing.xs,
  },
  botaoTexto: {
    color: colors.background,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  cardPeso: { color: colors.primary, fontSize: 18, fontWeight: "bold" },
  cardDetalhe: { color: colors.text, fontSize: 13, marginTop: 2 },
  cardData: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm },
});
