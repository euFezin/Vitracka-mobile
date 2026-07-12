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

const valores = [
  {
    icone: "📐",
    titulo: "Ciência antes de achismo",
    texto:
      "Cálculos baseados em TMB, TDEE e distribuição de macros — não em fórmulas mágicas.",
  },
  {
    icone: "⚡",
    titulo: "Simplicidade sem enrolação",
    texto:
      "Menos telas, menos fricção. O que importa é você entender seu plano e seguir com consistência.",
  },
  {
    icone: "🤖",
    titulo: "IA a favor do seu progresso",
    texto:
      "A Vix existe para tirar dúvidas reais sobre dieta — sem enrolação e sem respostas genéricas.",
  },
];

export default function AboutScreen() {
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
        label="Nossa história"
        title="Sobre o"
        highlight="Vitracka"
        subtitle="Um coach nutricional com IA, feito para quem quer treinar e comer com estratégia — sem planilha complicada e sem achismo."
      />

      <Text style={styles.h2}>Nossa missão</Text>
      <Text style={styles.p}>
        O Vitracka nasceu para resolver um problema simples: montar uma dieta
        que faça sentido com o seu objetivo — hipertrofia, emagrecimento ou
        manutenção — sem precisar entender de nutrição ou perder horas
        calculando macros na mão.
      </Text>
      <Text style={styles.p}>
        A ideia é reunir, em um único lugar, o cálculo de calorias e macros, a
        geração de planos alimentares e um coach de IA disponível para tirar
        dúvidas no momento em que elas aparecem.
      </Text>

      <Text style={styles.h2}>Como surgiu</Text>
      <Text style={styles.p}>
        O projeto começou como um estudo pessoal, unindo duas áreas de
        interesse: desenvolvimento de software e treino de hipertrofia. A partir
        daí, o Vitracka foi evoluindo — de uma calculadora simples de calorias
        para uma plataforma completa, com histórico de progresso, planos
        personalizados e um coach de IA chamado Vix.
      </Text>
      <Text style={styles.p}>
        O Vitracka está em desenvolvimento ativo e em fase alpha — novas
        funcionalidades chegam com frequência, e o feedback de quem usa ajuda a
        moldar os próximos passos.
      </Text>

      <Text style={styles.h2}>O que nos move</Text>
      {valores.map((v, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardIcone}>{v.icone}</Text>
          <Text style={styles.cardTitulo}>{v.titulo}</Text>
          <Text style={styles.cardTexto}>{v.texto}</Text>
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
  h2: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  p: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
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
