export const colors = {
  background: "#0F172A",
  card: "#1E293B",
  surfaceAlt: "#0F172A",
  primary: "#22C55E",
  primaryMuted: "rgba(34, 197, 94, 0.25)",
  danger: "#EF4444",
  dangerMuted: "rgba(239, 68, 68, 0.25)",
  text: "#F8FAFC",
  textMuted: "#94A3B8",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const radius = {
  input: 14,
  button: 16,
  card: 20,
  pill: 999,
};

export const typography = {
  titulo: { fontSize: 28, fontWeight: "bold", color: colors.text },
  subtitulo: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  label: { fontSize: 13, fontWeight: "bold", color: colors.text },
  corpo: { fontSize: 14, color: colors.text, lineHeight: 20 },
  valor: { fontSize: 18, fontWeight: "bold", color: colors.text },
};

export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingTop: 60,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  surfaceAlt: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.card - 2,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    padding: 16,
    borderRadius: radius.input,
    marginBottom: spacing.xl,
  },
  botao: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: radius.button,
    marginTop: spacing.sm,
  },
  botaoTexto: {
    color: colors.background,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
};
