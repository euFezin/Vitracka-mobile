import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../api";
import { colors, radius, spacing } from "../theme";

export default function ChatScreen({ token }) {
  const [mensagens, setMensagens] = useState([]);
  const [pergunta, setPergunta] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [conversas, setConversas] = useState([]);
  const [historicoVisivel, setHistoricoVisivel] = useState(false);
  const [teclaAberta, setTeclaAberta] = useState(false);
  const listRef = useRef(null);
  const tabBarHeight = useBottomTabBarHeight();

  const carregarConversas = useCallback(async () => {
    try {
      const response = await api.get("/conversas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversas(response.data.conversas);
    } catch (error) {
      // silencioso, histórico não é crítico
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      carregarConversas();
    }, [carregarConversas]),
  );

  useState(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setTeclaAberta(true),
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setTeclaAberta(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  });

  async function abrirConversa(id) {
    if (id === conversationId) {
      setHistoricoVisivel(false);
      return;
    }

    try {
      const response = await api.get(`/conversas/${id}/mensagens`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensagens(response.data.mensagens);
      setConversationId(id);
      setHistoricoVisivel(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 100);
    } catch (error) {
      // ignora, mantém conversa atual
    }
  }

  function novaConversa() {
    setMensagens([]);
    setConversationId(null);
    setHistoricoVisivel(false);
  }

  async function excluirConversa(id) {
    try {
      await api.post(
        `/conversas/${id}/excluir`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setConversas((atual) => atual.filter((c) => c.id !== id));
      if (id === conversationId) {
        novaConversa();
      }
    } catch (error) {
      // ignora
    }
  }

  async function enviarMensagem() {
    const texto = pergunta.trim();
    if (!texto) return;

    setMensagens((atual) => [...atual, { role: "user", content: texto }]);
    setPergunta("");
    setEnviando(true);

    try {
      const response = await api.post(
        "/chat",
        { pergunta: texto, conversation_id: conversationId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setConversationId(response.data.conversation_id);
      setMensagens((atual) => [
        ...atual,
        { role: "assistant", content: response.data.answer },
      ]);
      carregarConversas();
    } catch (error) {
      setMensagens((atual) => [
        ...atual,
        { role: "assistant", content: "Erro ao conversar com a Vix." },
      ]);
    } finally {
      setEnviando(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  const espacoExtra = teclaAberta
    ? spacing.sm
    : Platform.OS === "ios"
      ? tabBarHeight + 55
      : tabBarHeight + 40;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.titulo}>✦ Vix AI</Text>
        <View style={styles.headerBotoes}>
          <TouchableOpacity onPress={novaConversa} style={styles.headerBotao}>
            <Ionicons name="add" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setHistoricoVisivel(true)}
            style={styles.headerBotao}
          >
            <Ionicons name="time-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {mensagens.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioIcone}>🥗</Text>
          <Text style={styles.vazioTexto}>
            Pergunte qualquer coisa sobre nutrição,{"\n"} estratégia alimentar
            ou treinos.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={mensagens}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <View
              style={[
                styles.linhaMensagem,
                item.role === "user" && styles.linhaMensagemUser,
              ]}
            >
              {item.role === "assistant" && (
                <View style={styles.avatarVix}>
                  <Text style={styles.avatarVixTexto}>✦</Text>
                </View>
              )}
              <View
                style={[
                  styles.bolha,
                  item.role === "user"
                    ? styles.bolhaUser
                    : styles.bolhaAssistant,
                ]}
              >
                <Text
                  style={
                    item.role === "user"
                      ? styles.textoBolhaUser
                      : styles.textoBolhaAssistant
                  }
                >
                  {item.content}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      {enviando && (
        <ActivityIndicator
          color={colors.primary}
          style={{ marginBottom: spacing.sm }}
        />
      )}

      <View style={[styles.inputArea, { marginBottom: espacoExtra }]}>
        <TextInput
          style={styles.input}
          placeholder="Pergunte sobre nutrição, treino..."
          placeholderTextColor={colors.textMuted}
          value={pergunta}
          onChangeText={setPergunta}
          multiline
        />
        <TouchableOpacity style={styles.botaoEnviar} onPress={enviarMensagem}>
          <Ionicons name="send" size={18} color={colors.background} />
        </TouchableOpacity>
      </View>

      <Modal visible={historicoVisivel} animationType="slide" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modalConteudo}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Conversas</Text>
              <TouchableOpacity onPress={() => setHistoricoVisivel(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.novaConversaBotao}
              onPress={novaConversa}
            >
              <Ionicons
                name="add-circle-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.novaConversaTexto}>Nova conversa</Text>
            </TouchableOpacity>

            <FlatList
              data={conversas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.conversaItem,
                    item.id === conversationId && styles.conversaItemAtiva,
                  ]}
                  onPress={() => abrirConversa(item.id)}
                >
                  <Text style={styles.conversaTitulo} numberOfLines={1}>
                    {item.titulo}
                  </Text>
                  <TouchableOpacity
                    onPress={() => excluirConversa(item.id)}
                    hitSlop={10}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.semConversas}>Nenhuma conversa ainda.</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  titulo: { fontSize: 22, fontWeight: "bold", color: colors.text },
  headerBotoes: { flexDirection: "row", gap: spacing.sm },
  headerBotao: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  vazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xxl,
  },
  vazioIcone: { fontSize: 40, marginBottom: spacing.md },
  vazioTexto: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  lista: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  linhaMensagem: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: spacing.md,
    maxWidth: "90%",
  },
  linhaMensagemUser: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  avatarVix: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryMuted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  avatarVixTexto: { color: colors.primary, fontSize: 13, fontWeight: "bold" },
  bolha: { padding: spacing.md, borderRadius: radius.card - 4, flexShrink: 1 },
  bolhaUser: { backgroundColor: colors.primary },
  bolhaAssistant: { backgroundColor: colors.card },
  textoBolhaUser: { color: colors.background, fontSize: 14, lineHeight: 20 },
  textoBolhaAssistant: { color: colors.text, fontSize: 14, lineHeight: 20 },
  inputArea: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.card,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    color: colors.text,
    borderRadius: radius.input,
    padding: 12,
    marginRight: spacing.sm,
    maxHeight: 100,
  },
  botaoEnviar: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
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
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modalTitulo: { fontSize: 20, fontWeight: "bold", color: colors.text },
  novaConversaBotao: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.button,
    marginBottom: spacing.lg,
  },
  novaConversaTexto: { color: colors.primary, fontWeight: "bold" },
  conversaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.button,
    marginBottom: spacing.xs,
  },
  conversaItemAtiva: { backgroundColor: colors.card },
  conversaTitulo: { color: colors.text, flex: 1, marginRight: spacing.md },
  semConversas: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
