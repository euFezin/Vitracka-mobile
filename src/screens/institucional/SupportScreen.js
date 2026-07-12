import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import PageHeader from "../../components/PageHeader";
import { colors, radius, spacing } from "../../theme";

const faqs = [
  {
    pergunta: "Como o Vitracka calcula minhas calorias e macros?",
    resposta:
      "Usamos seus dados de peso, altura, idade, sexo e nível de atividade para calcular sua Taxa Metabólica Basal (TMB) e seu Gasto Energético Total (TDEE). A partir disso, geramos cenários de bulking, cutting e manutenção com as calorias e macros ajustados para cada objetivo.",
  },
  {
    pergunta: "Posso mudar meu objetivo depois de criar o plano?",
    resposta:
      "Sim. Você pode refazer o cálculo e escolher um novo cenário (bulking, cutting ou manutenção) sempre que quiser, direto pelo seu dashboard.",
  },
  {
    pergunta: "A Vix AI responde qualquer tipo de pergunta?",
    resposta:
      "A Vix é especializada em nutrição esportiva — dúvidas sobre dieta, macros, calorias, suplementação e estratégias de bulking, cutting e manutenção. Perguntas fora desse escopo não são respondidas pela Vix.",
  },
  {
    pergunta: "Posso regenerar uma refeição sugerida?",
    resposta:
      "Sim. Se uma sugestão de refeição não fizer sentido pra você, é possível regenerar apenas aquela refeição, sem precisar refazer o plano inteiro.",
  },
  {
    pergunta: "Como funciona o check-in de progresso?",
    resposta:
      "No check-in você registra seu peso periodicamente. Com isso, o Vitracka acompanha sua evolução ao longo do tempo e mantém seu streak de consistência no dashboard.",
  },
  {
    pergunta: "Meus dados estão seguros?",
    resposta:
      "Sim. Suas senhas são armazenadas com hash, o acesso é protegido por sessão autenticada e seus dados nunca são vendidos a terceiros. Veja os detalhes completos na Política de Privacidade.",
  },
  {
    pergunta: "Esqueci minha senha, o que eu faço?",
    resposta:
      "No momento, a recuperação de senha ainda está sendo implementada — o Vitracka está em fase alpha. Enquanto isso, entre em contato pelo canal abaixo que ajudamos você a recuperar o acesso.",
  },
  {
    pergunta:
      "Encontrei um bug ou algo não funcionou como esperado. Como reporto?",
    resposta:
      "Manda um e-mail contando o que aconteceu (se possível, com prints da tela). Como o projeto está em desenvolvimento ativo, todo relato ajuda a melhorar a plataforma.",
  },
];

export default function SupportScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const [aberto, setAberto] = useState(null);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: tabBarHeight + 40 }}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>

      <PageHeader
        label="Estamos aqui pra ajudar"
        title="Suporte"
        subtitle="Dúvidas comuns sobre o Vitracka. Não achou o que precisava? Fala com a gente lá embaixo."
      />

      {faqs.map((faq, i) => (
        <TouchableOpacity
          key={i}
          style={styles.faqItem}
          onPress={() => setAberto(aberto === i ? null : i)}
        >
          <View style={styles.faqHeader}>
            <Text style={styles.faqPergunta}>{faq.pergunta}</Text>
            <Ionicons
              name={aberto === i ? "remove" : "add"}
              size={18}
              color={colors.primary}
            />
          </View>
          {aberto === i && (
            <Text style={styles.faqResposta}>{faq.resposta}</Text>
          )}
        </TouchableOpacity>
      ))}

      <View style={styles.contatoCard}>
        <Text style={styles.contatoTitulo}>Ainda precisa de ajuda?</Text>
        <Text style={styles.contatoTexto}>
          Manda uma mensagem que a gente responde o quanto antes.
        </Text>
        <TouchableOpacity
          style={styles.contatoBotao}
          onPress={() => Linking.openURL("mailto:contato@vitracka.com")}
        >
          <Text style={styles.contatoBotaoTexto}>contato@vitracka.com</Text>
        </TouchableOpacity>
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
  voltar: { marginBottom: spacing.lg },
  faqItem: {
    backgroundColor: colors.card,
    borderRadius: radius.card - 4,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqPergunta: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
    marginRight: spacing.sm,
  },
  faqResposta: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.md,
  },
  contatoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.xl,
    marginTop: spacing.xl,
    alignItems: "center",
  },
  contatoTitulo: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  contatoTexto: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  contatoBotao: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.button,
  },
  contatoBotaoTexto: { color: colors.background, fontWeight: "bold" },
});
