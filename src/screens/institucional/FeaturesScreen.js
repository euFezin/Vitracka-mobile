import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import PageHeader from "../../components/PageHeader";
import { colors, radius, spacing } from "../../theme";

const features = [
  {
    icone: "⚡",
    titulo: "Cálculo de TMB e TDEE",
    texto:
      "Sua Taxa Metabólica Basal e seu Gasto Energético Total calculados a partir do seu peso, altura, idade, sexo e nível de atividade.",
  },
  {
    icone: "🎯",
    titulo: "Cenários por objetivo",
    texto:
      "Bulking, cutting ou manutenção — cada cenário chega com calorias e macros ajustados para o resultado que você quer.",
  },
  {
    icone: "🥗",
    titulo: "Refeições sugeridas",
    texto:
      "Suas calorias distribuídas em refeições com alimentos reais, respeitando seus macros ao detalhe — e você pode regenerar qualquer refeição isoladamente.",
  },
  {
    icone: "💬",
    titulo: "Vix AI — seu coach nutricional",
    texto:
      "Tire dúvidas sobre dieta, substituições e estratégias com a Vix, uma IA focada exclusivamente em nutrição esportiva.",
  },
  {
    icone: "📈",
    titulo: "Check-in de progresso",
    texto:
      "Registre seu peso periodicamente e acompanhe sua evolução — sem precisar de planilha externa.",
  },
  {
    icone: "🔥",
    titulo: "Streak de consistência",
    texto:
      "O dashboard acompanha sua sequência de check-ins, reforçando o hábito de manter a dieta em dia.",
  },
  {
    icone: "🧠",
    titulo: "Explicação personalizada do plano",
    texto:
      "Entenda o porquê das suas calorias e macros, com uma explicação gerada por IA sobre o seu cenário específico.",
  },
  {
    icone: "🛠️",
    titulo: "Perfil e metas ajustáveis",
    texto:
      "Mudou de objetivo? Atualize seu perfil e refaça o cálculo a qualquer momento, direto pelo dashboard.",
  },
];

export default function FeaturesScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: tabBarHeight + 40 }}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>

      <PageHeader
        label="Tudo em um só lugar"
        title="Funcionalidades"
        subtitle="Do cálculo das suas calorias ao acompanhamento do seu progresso — tudo que o Vitracka oferece pra você evoluir com consistência."
      />

      {features.map((f, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardIcone}>{f.icone}</Text>
          <Text style={styles.cardTitulo}>{f.titulo}</Text>
          <Text style={styles.cardTexto}>{f.texto}</Text>
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
  voltar: { marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardIcone: { fontSize: 22, marginBottom: spacing.sm },
  cardTitulo: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardTexto: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
});
