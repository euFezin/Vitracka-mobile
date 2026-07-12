import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import PageHeader from "../../components/PageHeader";
import { colors, spacing } from "../../theme";

export default function PrivacyScreen() {
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
        label="Transparência"
        title="Política de"
        highlight="Privacidade"
        subtitle="Como o Vitracka coleta, usa e protege os seus dados — em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)."
      />
      <Text style={styles.atualizado}>Última atualização: julho de 2026</Text>

      <Text style={styles.h2}>1. Quem somos</Text>
      <Text style={styles.p}>
        O Vitracka é uma plataforma de acompanhamento nutricional que usa
        inteligência artificial para calcular metas calóricas, sugerir planos
        alimentares e responder dúvidas sobre dieta através do assistente Vix
        AI. Para os fins desta política, o Vitracka atua como controlador dos
        dados pessoais tratados na aplicação.
      </Text>

      <Text style={styles.h2}>2. Quais dados coletamos</Text>
      <Text style={styles.li}>
        • Dados de conta: nome, e-mail e senha (armazenada com hash, nunca em
        texto puro).
      </Text>
      <Text style={styles.li}>
        • Perfil físico: peso, altura, idade, sexo e nível de atividade.
      </Text>
      <Text style={styles.li}>
        • Objetivos e planos: meta escolhida, plano calórico e distribuição de
        macros.
      </Text>
      <Text style={styles.li}>
        • Refeições: sugestões geradas e regeneradas dentro da plataforma.
      </Text>
      <Text style={styles.li}>
        • Check-ins de progresso: peso e anotações registradas ao longo do
        tempo.
      </Text>
      <Text style={styles.li}>
        • Conversas com a Vix AI: as mensagens trocadas no chat de nutrição.
      </Text>

      <Text style={styles.h2}>3. Como usamos seus dados</Text>
      <Text style={styles.p}>
        Usamos essas informações exclusivamente para calcular suas metas
        nutricionais, gerar planos e sugestões de refeição personalizadas,
        acompanhar sua evolução no dashboard e permitir que a Vix AI responda
        suas dúvidas com contexto sobre o seu plano.
      </Text>
      <Text style={styles.p}>
        A base legal para esse tratamento é a execução do contrato (fornecer o
        serviço que você solicitou ao criar sua conta) e, quando aplicável, o
        seu consentimento.
      </Text>

      <Text style={styles.h2}>4. Compartilhamento com terceiros</Text>
      <Text style={styles.p}>
        Para gerar as respostas da Vix AI e as explicações personalizadas do seu
        plano, enviamos o conteúdo necessário da conversa a provedores de
        inferência de IA (como a API da Hugging Face). Nenhum dado é vendido ou
        usado para fins publicitários.
      </Text>

      <Text style={styles.h2}>5. Armazenamento e segurança</Text>
      <Text style={styles.p}>
        Seus dados ficam armazenados em banco de dados MySQL. Senhas passam por
        hash antes de serem salvas. O acesso à sua conta é controlado por sessão
        autenticada, e chaves de API ficam fora do controle de versão do
        projeto, em variáveis de ambiente.
      </Text>

      <Text style={styles.h2}>6. Cookies e sessão</Text>
      <Text style={styles.p}>
        Utilizamos apenas um cookie de sessão, necessário para manter você
        autenticado. O Vitracka não usa cookies de rastreamento, publicidade ou
        analytics de terceiros.
      </Text>

      <Text style={styles.h2}>7. Seus direitos (LGPD)</Text>
      <Text style={styles.p}>Como titular dos dados, você tem direito a:</Text>
      <Text style={styles.li}>
        • Confirmar a existência de tratamento dos seus dados;
      </Text>
      <Text style={styles.li}>
        • Acessar, corrigir ou atualizar seus dados;
      </Text>
      <Text style={styles.li}>
        • Solicitar a exclusão da sua conta e dos dados associados;
      </Text>
      <Text style={styles.li}>• Solicitar a portabilidade dos seus dados;</Text>
      <Text style={styles.li}>
        • Revogar o consentimento dado, quando aplicável.
      </Text>

      <Text style={styles.h2}>8. Retenção e exclusão</Text>
      <Text style={styles.p}>
        Seus dados são mantidos enquanto sua conta estiver ativa. Ao solicitar o
        encerramento da conta, os dados pessoais são removidos ou anonimizados,
        exceto quando houver obrigação legal de retenção.
      </Text>

      <Text style={styles.h2}>9. Alterações nesta política</Text>
      <Text style={styles.p}>
        Esta política pode ser atualizada conforme o Vitracka evolui. Mudanças
        relevantes serão indicadas pela data de "última atualização" no topo
        desta página.
      </Text>

      <Text style={styles.h2}>10. Contato</Text>
      <Text style={styles.p}>
        Dúvidas sobre esta política podem ser enviadas para
        contato@vitracka.com.
      </Text>
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
  atualizado: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.xl,
  },
  h2: {
    fontSize: 17,
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
  li: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 21,
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
  },
});
