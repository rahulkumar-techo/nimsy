/**
 * Auth Context (Global State)
 * Handles user session across app
 */

import AsyncStorage from "@react-native-async-storage/async-storage"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"

type User = {
  id: string
  name: string
  email: string
  photo?: string
}

type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => Promise<void>
  hasCompletedOnboarding: boolean
  isOnboardingReady: boolean
  completeOnboarding: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_STORAGE_KEY = "auth_user"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] =
    useState(false)
  const [isOnboardingReady, setIsOnboardingReady] = useState(false)

  /**
   * Load saved user on app start
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY)

        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser)
          setUserState(parsedUser)
        }
      } catch (error) {
        console.log("Failed to load user", error)
      } finally {
        setIsOnboardingReady(true)
      }
    }

    loadUser()
  }, [])

  /**
   * Save/remove user from storage
   */
  const setUser = async (nextUser: User | null) => {
    try {
      if (nextUser) {
        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(nextUser)
        )
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY)
      }

      setUserState(nextUser)

      if (!nextUser) {
        setHasCompletedOnboarding(false)
      }
    } catch (error) {
      console.log("Failed to save user", error)
    }
  }

  /**
   * Sync onboarding state
   */
  useEffect(() => {
    let isMounted = true

    const syncOnboardingState = async () => {
      if (!user?.id) {
        if (!isMounted) return

        setHasCompletedOnboarding(false)
        return
      }

      try {
        const storedValue = await AsyncStorage.getItem(
          `onboarding:${user.id}`
        )

        if (isMounted) {
          setHasCompletedOnboarding(storedValue === "true")
        }
      } catch (error) {
        console.log("Failed to load onboarding state", error)

        if (isMounted) {
          setHasCompletedOnboarding(false)
        }
      }
    }

    syncOnboardingState()

    return () => {
      isMounted = false
    }
  }, [user?.id])

  /**
   * Complete onboarding
   */
  const completeOnboarding = async () => {
    if (!user?.id) return

    setHasCompletedOnboarding(true)

    try {
      await AsyncStorage.setItem(
        `onboarding:${user.id}`,
        "true"
      )
    } catch (error) {
      console.log("Failed to save onboarding state", error)
    }
  }

  /**
   * Logout
   */
  const logout = async () => {
    try {
      const isSignedIn = await GoogleSignin.hasPreviousSignIn()

      if (isSignedIn) {
        await GoogleSignin.signOut()
      }
    } catch (error) {
      console.log("Logout failed", error)
    } finally {
      await AsyncStorage.removeItem(USER_STORAGE_KEY)
      setUserState(null)
      setHasCompletedOnboarding(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        hasCompletedOnboarding,
        isOnboardingReady,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}