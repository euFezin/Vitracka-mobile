import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useRouter } from "expo-router";
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

export default function SettingsScreen({ token, onLogout }) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const tabBarHeight = useBottomTabBarHeight();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const [senhaExclusao, setSenhaExclusao] = useState("");
  const [excluindo, setExcluindo] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      const response = await api.get("/configuracoes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNome(response.data.usuario.nome);
      setEmail(response.data.usuario.email);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar seus dados.");
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados]),
  );

  async function salvarPerfil() {
    if (!nome.trim() || !email.trim()) {
      Alert.alert("Atenção", "Preencha nome e email.");
      return;
    }

    setSalvandoPerfil(true);
    try {
      await api.put(
        "/configuracoes/perfil",
        { nome: nome.trim(), email: email.trim().toLowerCase() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      Alert.alert("Sucesso", "Perfil atualizado.");
    } catch (error) {
      const msg =
        error.response?.data?.erro || "Não foi possível atualizar o perfil.";
      Alert.alert("Erro", msg);
    } finally {
      setSalvandoPerfil(false);
    }
  }

  async function salvarSenha() {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos de senha.");
      return;
    }

    setSalvandoSenha(true);
    try {
      await api.put(
        "/configuracoes/senha",
        {
          senha_atual: senhaAtual,
          nova_senha: novaSenha,
          confirmar_senha: confirmarSenha,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      Alert.alert("Sucesso", "Senha alterada.");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      const msg =
        error.response?.data?.erro || "Não foi possível alterar a senha.";
      Alert.alert("Erro", msg);
    } finally {
      setSalvandoSenha(false);
    }
  }

  function confirmarExclusao() {
    if (!senhaExclusao) {
      Alert.alert("Atenção", "Digite sua senha para confirmar.");
      return;
    }

    Alert.alert(
      "Excluir conta",
      "Essa ação não pode ser desfeita. Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: excluirConta },
      ],
    );
  }

  async function excluirConta() {
    setExcluindo(true);
    try {
      await api.post(
        "/configuracoes/excluir-conta",
        { senha: senhaExclusao },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onLogout();
    } catch (error) {
      const msg =
        error.response?.data?.erro || "Não foi possível excluir a conta.";
      Alert.alert("Erro", msg);
    } finally {
      setExcluindo(false);
    }
  }

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
          Platform.OS === "ios" ? tabBarHeight + 60 : tabBarHeight + 100,
      }}
    >
      <Text style={styles.titulo}>Configurações</Text>

      <Text style={styles.secao}>Perfil</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor={colors.textMuted}
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={styles.botao}
        onPress={salvarPerfil}
        disabled={salvandoPerfil}
      >
        <Text style={styles.botaoTexto}>
          {salvandoPerfil ? "Salvando..." : "Salvar perfil"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.secao}>Alterar senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha atual"
        placeholderTextColor={colors.textMuted}
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        placeholderTextColor={colors.textMuted}
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar nova senha"
        placeholderTextColor={colors.textMuted}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.botao}
        onPress={salvarSenha}
        disabled={salvandoSenha}
      >
        <Text style={styles.botaoTexto}>
          {salvandoSenha ? "Salvando..." : "Alterar senha"}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.secao, styles.secaoPerigo]}>Excluir conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha para confirmar"
        placeholderTextColor={colors.textMuted}
        value={senhaExclusao}
        onChangeText={setSenhaExclusao}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.botaoPerigo}
        onPress={confirmarExclusao}
        disabled={excluindo}
      >
        <Text style={styles.botaoTexto}>
          {excluindo ? "Excluindo..." : "Excluir minha conta"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.secao}>Sobre o app</Text>
      <TouchableOpacity
        style={styles.linkInstitucional}
        onPress={() => router.push("/sobre")}
      >
        <Text style={styles.linkInstitucionalTexto}>Sobre o Vitracka</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkInstitucional}
        onPress={() => router.push("/funcionalidades")}
      >
        <Text style={styles.linkInstitucionalTexto}>Funcionalidades</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkInstitucional}
        onPress={() => router.push("/suporte")}
      >
        <Text style={styles.linkInstitucionalTexto}>Suporte</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkInstitucional}
        onPress={() => router.push("/privacidade")}
      >
        <Text style={styles.linkInstitucionalTexto}>
          Política de Privacidade
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoSair} onPress={onLogout}>
        <Text style={styles.botaoTextoSair}>Sair</Text>
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
  titulo: { ...typography.titulo, fontSize: 24, marginBottom: spacing.lg },
  secao: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  secaoPerigo: { color: colors.danger },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    padding: 14,
    borderRadius: radius.input,
    marginBottom: spacing.md,
  },
  botao: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: radius.button,
    marginTop: spacing.xs,
  },
  botaoPerigo: {
    backgroundColor: colors.danger,
    padding: 14,
    borderRadius: radius.button,
    marginTop: spacing.xs,
  },
  botaoSair: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.textMuted,
    padding: 14,
    borderRadius: radius.button,
    marginTop: spacing.xxl,
  },
  botaoTexto: {
    color: colors.background,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  botaoTextoSair: {
    color: colors.text,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkInstitucional: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.button,
    marginBottom: spacing.sm,
  },
  linkInstitucionalTexto: { color: colors.text, fontWeight: "600" },
});
