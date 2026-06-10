/**
 * Auth Context
 * Manages authenticated user state
 */

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { authStorage, User } from "@/utils/auth-storage";
import { useAuthActions } from "@/hooks/useAuthActions";

export type { User };

type AuthContextType = {
  user: User | null;
  hasCompletedOnboarding: boolean;
   setHasCompletedOnboarding: (value: boolean) => void;
  isOnboardingReady: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUserState] = useState<User | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isOnboardingReady, setIsOnboardingReady] = useState(false);

  const { me } = useAuthActions();

  /**
   * Fetch current user from backend
   */
  const refreshUser = async () => {
    try {
      const response = await me();

      //       console.log(
      //   JSON.stringify(response, null, 2)
      // );

      if (!response.data) {
        setUserState(null);
        setHasCompletedOnboarding(false);
        return;
      }

      setUserState(response.data);
      setHasCompletedOnboarding(
        response.data.onboardingCompleted
      );
    } catch (error) {
      console.log("Failed to fetch user", error);

      setUserState(null);
      setHasCompletedOnboarding(false);
    }
  };

  /**
   * Restore authentication state on app launch
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken =
          await authStorage.getAccessToken();

        if (accessToken) {
          await refreshUser();
        }
      } catch (error) {
        console.log(
          "Failed to initialize auth",
          error
        );
      } finally {
        setIsOnboardingReady(true);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Update user in memory
   */
  const setUser = (user: User | null) => {
    setUserState(user);
  };

  /**
   * Clear session and sign out
   */
  const logout = async () => {
    try {
      const isSignedIn =
        await GoogleSignin.hasPreviousSignIn();

      if (isSignedIn) {
        await GoogleSignin.signOut();
      }
    } catch (error) {
      console.log("Google sign out failed", error);
    } finally {
      await authStorage.clear();

      setUserState(null);
      setHasCompletedOnboarding(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        hasCompletedOnboarding,
        isOnboardingReady,
        setHasCompletedOnboarding,
        setUser,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Access auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};