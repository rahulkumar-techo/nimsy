import { useAuth } from "@/context/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.log("Logout failed", error);
    } finally {
      logout();
    }
  };

  const initials = user?.name?.trim().charAt(0).toUpperCase() ?? "N";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.copyBlock}>
            <Text style={styles.eyebrow}>Signed in</Text>
            <Text style={styles.title}>Hi, {user?.name ?? "there"}</Text>
            <Text style={styles.subtitle}>
              Your tab navigation is active and your home screen is now routed
              through the shared `screens/home.tsx` component.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Email</Text>
          <Text style={styles.cardValue}>{user?.email ?? "No email found"}</Text>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eff6ff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 20,
  },
  hero: {
    borderRadius: 28,
    backgroundColor: "#1d4ed8",
    padding: 24,
    gap: 20,
  },
  avatar: {
    height: 68,
    width: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
  },
  copyBlock: {
    gap: 8,
  },
  eyebrow: {
    color: "#bfdbfe",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#dbeafe",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderRadius: 22,
    backgroundColor: "#ffffff",
    padding: 20,
    gap: 8,
  },
  cardLabel: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  cardValue: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: "auto",
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: "#0f172a",
    paddingVertical: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
