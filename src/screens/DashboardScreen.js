import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../api";
import { colors, radius, spacing, typography } from "../theme";

const META_AGUA = 3000;

export default function DashboardScreen({ token }) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  const [nomeUsuario, setNomeUsuario] = useState("");

  const [modalPlanoVisivel, setModalPlanoVisivel] = useState(false);
  const [cenarios, setCenarios] = useState([]);
  const [carregandoCenarios, setCarregandoCenarios] = useState(false);
  const [selecionando, setSelecionando] = useState(null);

  const [tracker, setTracker] = useState(null);
  const [medias, setMedias] = useState(null);
  const [sonoInput, setSonoInput] = useState("");
  const [atualizandoAgua, setAtualizandoAgua] = useState(false);
  const [salvandoSono, setSalvandoSono] = useState(false);

  const carregarDashboard = useCallback(async () => {
    try {
      const [dashboardRes, configRes, trackerRes, historicoRes] =
        await Promise.all([
          api.get("/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/configuracoes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/tracker/hoje", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/tracker/historico", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
      setDados(dashboardRes.data);
      setNomeUsuario(configRes.data.usuario.nome.split(" ")[0]);
      setTracker(trackerRes.data);
      setSonoInput(
        trackerRes.data.sono_horas ? String(trackerRes.data.sono_horas) : "",
      );
      setMedias(historicoRes.data.medias);
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

  async function ajustarAgua(delta) {
    if (!tracker) return;
    const novoValor = Math.max(0, tracker.agua_ml + delta);
    setAtualizandoAgua(true);
    setTracker((atual) => ({ ...atual, agua_ml: novoValor }));

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
      setTracker((atual) => ({
        ...atual,
        sono_horas: response.data.sono_horas,
      }));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o sono.");
    } finally {
      setSalvandoSono(false);
    }
  }

  async function abrirModalPlano() {
    setModalPlanoVisivel(true);
    setCarregandoCenarios(true);
    try {
      const response = await api.get("/onboarding/cenarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCenarios(response.data.cenarios);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível calcular os cenários. Confira se seu perfil físico está completo.",
      );
      setModalPlanoVisivel(false);
    } finally {
      setCarregandoCenarios(false);
    }
  }

  async function escolherNovoPlano(cenario) {
    setSelecionando(cenario.nome);
    try {
      await api.post(
        "/onboarding/plano",
        {
          nome: cenario.nome,
          calorias: cenario.calorias,
          proteina: cenario.proteina,
          carboidratos: cenario.carboidratos,
          gordura: cenario.gordura,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setModalPlanoVisivel(false);
      carregarDashboard();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar o plano.");
    } finally {
      setSelecionando(null);
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
        <Text style={styles.texto}>Erro ao carregar dashboard.</Text>
      </View>
    );
  }

  const progresso = Math.max(0, Math.min(dados.progresso ?? 0, 100));
  const progressoAgua = tracker
    ? Math.min((tracker.agua_ml / META_AGUA) * 100, 100)
    : 0;

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

          <TouchableOpacity
            style={styles.botaoAlterarPlano}
            onPress={abrirModalPlano}
          >
            <Text style={styles.botaoAlterarPlanoTexto}>Alterar plano</Text>
          </TouchableOpacity>
        </View>
      )}

      {tracker && (
        <>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="water" size={18} color={colors.primary} />
              <Text style={styles.label}>Água hoje</Text>
            </View>

            <Text style={styles.valor}>{tracker.agua_ml} ml</Text>
            <Text style={styles.progressoTexto}>Meta: {META_AGUA} ml</Text>

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
                onPress={() => ajustarAgua(-tracker.agua_ml)}
                disabled={atualizandoAgua}
              >
                <Ionicons name="refresh" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="moon" size={18} color={colors.primary} />
              <Text style={styles.label}>Sono de hoje</Text>
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
              <Text style={styles.label}>Médias</Text>
              <Text style={styles.mediaLinha}>
                💧 Diária: {medias.agua_ml.diaria ?? "-"} ml · Semanal:{" "}
                {medias.agua_ml.semanal ?? "-"} ml · Mensal:{" "}
                {medias.agua_ml.mensal ?? "-"} ml
              </Text>
              <Text style={styles.mediaLinha}>
                🌙 Diária: {medias.sono_horas.diaria ?? "-"} h · Semanal:{" "}
                {medias.sono_horas.semanal ?? "-"} h · Mensal:{" "}
                {medias.sono_horas.mensal ?? "-"} h
              </Text>
            </View>
          )}
        </>
      )}

      <Modal visible={modalPlanoVisivel} animationType="slide" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modalConteudo}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Escolha seu plano</Text>
              <TouchableOpacity onPress={() => setModalPlanoVisivel(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {carregandoCenarios ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ marginVertical: spacing.xl }}
              />
            ) : (
              <ScrollView>
                {cenarios.map((cenario, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.cenarioCard}
                    onPress={() => escolherNovoPlano(cenario)}
                    disabled={selecionando !== null}
                  >
                    <Text style={styles.cenarioNome}>{cenario.nome}</Text>
                    <Text style={styles.cenarioDescricao}>
                      {cenario.descricao}
                    </Text>
                    <Text style={styles.cenarioCalorias}>
                      {cenario.calorias} kcal
                    </Text>
                    <Text style={styles.cenarioMacro}>
                      P: {cenario.proteina}g · C: {cenario.carboidratos}g · G:{" "}
                      {cenario.gordura}g
                    </Text>
                    {selecionando === cenario.nome && (
                      <ActivityIndicator
                        color={colors.primary}
                        style={{ marginTop: spacing.sm }}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
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
  botaoAlterarPlano: {
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    padding: spacing.md,
    borderRadius: radius.button,
    alignItems: "center",
    marginTop: spacing.md,
  },
  botaoAlterarPlanoTexto: { color: colors.primary, fontWeight: "bold" },
  botoesAgua: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
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
  mediaLinha: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalConteudo: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    padding: spacing.xl,
    maxHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modalTitulo: { fontSize: 20, fontWeight: "bold", color: colors.text },
  cenarioCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cenarioNome: { color: colors.primary, fontSize: 17, fontWeight: "bold" },
  cenarioDescricao: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  cenarioCalorias: { color: colors.text, fontSize: 16, fontWeight: "bold" },
  cenarioMacro: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
});
