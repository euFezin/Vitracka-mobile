import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../api";

export default function OnboardingScreen({ token, onConcluido }) {
  const [passo, setPasso] = useState(1);
  const [carregando, setCarregando] = useState(false);

  // Passo 1: objetivo
  const [objetivo, setObjetivo] = useState("bulking");
  const [pesoAlvo, setPesoAlvo] = useState("");

  // Passo 2: perfil físico
  const [genero, setGenero] = useState("masculino");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [idade, setIdade] = useState("");
  const [atividade, setAtividade] = useState("moderado");

  // Passo 3: cenários
  const [cenarios, setCenarios] = useState([]);

  async function enviarObjetivo() {
    if (!pesoAlvo) {
      Alert.alert("Atenção", "Informe seu peso alvo.");
      return;
    }

    setCarregando(true);
    try {
      await api.post(
        "/onboarding/objetivo",
        { objetivo, peso_alvo: parseFloat(pesoAlvo.replace(",", ".")) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPasso(2);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o objetivo.");
    } finally {
      setCarregando(false);
    }
  }

  async function enviarPerfil() {
    if (!peso || !altura || !idade) {
      Alert.alert("Atenção", "Preencha peso, altura e idade.");
      return;
    }

    setCarregando(true);
    try {
      await api.post(
        "/onboarding/perfil",
        {
          genero,
          peso: parseFloat(peso.replace(",", ".")),
          altura: parseFloat(altura.replace(",", ".")),
          idade: parseInt(idade, 10),
          atividade,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const response = await api.get("/onboarding/cenarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCenarios(response.data.cenarios);
      setPasso(3);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível calcular os cenários.");
    } finally {
      setCarregando(false);
    }
  }

  async function escolherPlano(cenario) {
    setCarregando(true);
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
      onConcluido();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar o plano.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text style={styles.titulo}>Vamos te conhecer</Text>
      <Text style={styles.passoIndicador}>Passo {passo} de 3</Text>

      {passo === 1 && (
        <View>
          <Text style={styles.label}>Qual seu objetivo?</Text>
          <View style={styles.opcoes}>
            {["cutting", "bulking"].map((op) => (
              <TouchableOpacity
                key={op}
                style={[styles.opcao, objetivo === op && styles.opcaoAtiva]}
                onPress={() => setObjetivo(op)}
              >
                <Text style={styles.opcaoTexto}>
                  {op === "cutting" ? "Perder gordura" : "Ganhar massa"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Peso alvo (kg)"
            placeholderTextColor="#8fa88f"
            value={pesoAlvo}
            onChangeText={setPesoAlvo}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity
            style={styles.botao}
            onPress={enviarObjetivo}
            disabled={carregando}
          >
            <Text style={styles.botaoTexto}>
              {carregando ? "Aguarde..." : "Continuar"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {passo === 2 && (
        <View>
          <Text style={styles.label}>Gênero</Text>
          <View style={styles.opcoes}>
            {["masculino", "feminino"].map((op) => (
              <TouchableOpacity
                key={op}
                style={[styles.opcao, genero === op && styles.opcaoAtiva]}
                onPress={() => setGenero(op)}
              >
                <Text style={styles.opcaoTexto}>{op}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            placeholderTextColor="#8fa88f"
            value={peso}
            onChangeText={setPeso}
            keyboardType="decimal-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Altura (cm)"
            placeholderTextColor="#8fa88f"
            value={altura}
            onChangeText={setAltura}
            keyboardType="decimal-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Idade"
            placeholderTextColor="#8fa88f"
            value={idade}
            onChangeText={setIdade}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Nível de atividade</Text>
          <View style={styles.opcoesColuna}>
            {[
              { valor: "sedentario", label: "Sedentário" },
              { valor: "leve", label: "Leve" },
              { valor: "moderado", label: "Moderado" },
              { valor: "intenso", label: "Intenso" },
            ].map((op) => (
              <TouchableOpacity
                key={op.valor}
                style={[
                  styles.opcao,
                  atividade === op.valor && styles.opcaoAtiva,
                ]}
                onPress={() => setAtividade(op.valor)}
              >
                <Text style={styles.opcaoTexto}>{op.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.botao}
            onPress={enviarPerfil}
            disabled={carregando}
          >
            <Text style={styles.botaoTexto}>
              {carregando ? "Calculando..." : "Ver planos"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {passo === 3 && (
        <View>
          <Text style={styles.label}>Escolha seu plano</Text>
          {cenarios.map((cenario, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => escolherPlano(cenario)}
              disabled={carregando}
            >
              <Text style={styles.cardNome}>{cenario.nome}</Text>
              <Text style={styles.cardDescricao}>{cenario.descricao}</Text>
              <Text style={styles.cardCalorias}>{cenario.calorias} kcal</Text>
              <Text style={styles.cardMacro}>
                P: {cenario.proteina}g · C: {cenario.carboidratos}g · G:{" "}
                {cenario.gordura}g
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1a0f",
    padding: 20,
    paddingTop: 60,
  },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  passoIndicador: { color: "#8fa88f", fontSize: 13, marginBottom: 20 },
  label: {
    color: "#4caf50",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#1c2b1c",
    color: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  opcoes: { flexDirection: "row", gap: 10, marginBottom: 12 },
  opcoesColuna: { gap: 10, marginBottom: 12 },
  opcao: {
    backgroundColor: "#1c2b1c",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  opcaoAtiva: { backgroundColor: "#2e7d32" },
  opcaoTexto: { color: "#fff", textTransform: "capitalize" },
  botao: {
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#1c2b1c",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  cardNome: { color: "#4caf50", fontSize: 17, fontWeight: "bold" },
  cardDescricao: {
    color: "#8fa88f",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
  cardCalorias: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cardMacro: { color: "#8fa88f", fontSize: 13, marginTop: 2 },
});
