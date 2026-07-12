import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";

export default function PageHeader({ label, title, highlight, subtitle }) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{label}</Text>
      </View>
      <Text style={styles.title}>
        {title}
        {highlight ? <Text style={styles.highlight}> {highlight}</Text> : null}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.xxl },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: spacing.md,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 32,
  },
  highlight: { color: colors.primary },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 21,
    marginTop: spacing.md,
  },
});
