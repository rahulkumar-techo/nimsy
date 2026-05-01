import GoogleLogin from "@/components/google-login";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Nimsy</Text>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in with Google to continue into your workspace.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Continue with your account</Text>
          <Text style={styles.cardCopy}>
            We will use your Google profile to set up your session.
          </Text>
          <GoogleLogin />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 20,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#dbeafe",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#1d4ed8",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  title: {
    color: "#0f172a",
    fontSize: 34,
    fontWeight: "800",
  },
  subtitle: {
    color: "#475569",
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    borderRadius: 24,
    backgroundColor: "#ffffff",
    padding: 20,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  cardTitle: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardCopy: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 22,
  },
});
