import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { useAuth } from "@/context/AuthContext";

const webClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

export default function GoogleLogin() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId,
      scopes: ["profile", "email"],
    });
  }, []);

  const handleLogin = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const response = await GoogleSignin.signIn();

      if (response.type !== "success") {
        return;
      }

      setUser({
        id: response.data.user.id,
        name: response.data.user.name ?? response.data.user.givenName ?? "User",
        email: response.data.user.email,
        photo: response.data.user.photo ?? undefined,
      });
    } catch (error) {
      console.log("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={styles.text}>Continue with Google</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
