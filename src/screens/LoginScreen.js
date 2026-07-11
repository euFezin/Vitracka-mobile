import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../api";
import { colors, radius, spacing, typography } from "../theme";

function TextoDegrade({ texto, style }) {
  return (
    <MaskedView maskElement={<Text style={style}>{texto}</Text>}>
      <LinearGradient
        colors={[colors.primary, "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]}>{texto}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function LoginScreen({ onLoginSuccess }) {
  const [modoCadastro, setModoCadastro] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha email e senha.");
      return;
    }

    setCarregando(true);

    try {
      const response = await api.post("/login", { email, senha });
      onLoginSuccess(response.data.token, response.data.usuario);
    } catch (error) {
      Alert.alert("Erro", "Email ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleCadastro() {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    setCarregando(true);

    try {
      const response = await api.post("/cadastro", { nome, email, senha });
      onLoginSuccess(response.data.token, response.data.usuario);
    } catch (error) {
      const msg =
        error.response?.data?.erro || "Não foi possível criar a conta.";
      Alert.alert("Erro", msg);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/Vitracka.png")}
          style={styles.logo}
        />
        <Image
          source={require("../../assets/images/nome.png")}
          style={styles.logoNome}
        />

        <View style={styles.headlineLinha}>
          <Text style={styles.headlineBranco}>Seu coach </Text>
          <TextoDegrade
            texto="nutricional com IA"
            style={styles.headlineDegrade}
          />
        </View>

        <Text style={styles.subtitulo}>
          {modoCadastro
            ? "Crie sua conta para começar."
            : "Continue de onde parou."}
        </Text>
      </View>

      <View style={styles.form}>
        {modoCadastro && (
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor={colors.textMuted}
            value={nome}
            onChangeText={setNome}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={colors.textMuted}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={modoCadastro ? handleCadastro : handleLogin}
          disabled={carregando}
        >
          <Text style={styles.botaoTexto}>
            {carregando
              ? "Aguarde..."
              : modoCadastro
                ? "Criar conta"
                : "Entrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModoCadastro(!modoCadastro)}>
          <Text style={styles.link}>
            {modoCadastro
              ? "Já tem conta? Entrar"
              : "Não tem conta? Criar conta"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xxl,
    backgroundColor: colors.background,
  },
  header: { alignItems: "center", marginBottom: spacing.xxl },
  logo: {
    width: 96,
    height: 96,
    marginBottom: spacing.md,
    resizeMode: "contain",
  },
  logoNome: {
    width: 220,
    height: 56,
    marginBottom: spacing.xl,
    resizeMode: "contain",
  },
  headlineLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  headlineBranco: { fontSize: 24, fontWeight: "bold", color: colors.text },
  headlineDegrade: { fontSize: 24, fontWeight: "bold" },
  subtitulo: { ...typography.subtitulo, textAlign: "center" },
  form: {},
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    padding: 16,
    borderRadius: radius.input,
    marginBottom: spacing.lg,
  },
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
  link: { color: colors.textMuted, textAlign: "center", marginTop: spacing.xl },
});
