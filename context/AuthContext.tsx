/**
 * Auth Context (Global State)
 * Handles user session across app
 */

import AsyncStorage from "@react-native-async-storage/async-storage"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  photo?: string
}

type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => void
  hasCompletedOnboarding: boolean
  isOnboardingReady: boolean
  completeOnboarding: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [isOnboardingReady, setIsOnboardingReady] = useState(true)

  const setUser = (nextUser: User | null) => {
    setUserState(nextUser)
    if (nextUser) {
      setIsOnboardingReady(false)
      return
    }

    setHasCompletedOnboarding(false)
    setIsOnboardingReady(true)
  }

  useEffect(() => {
    let isMounted = true

    const syncOnboardingState = async () => {
      if (!user?.id) {
        if (!isMounted) return
        setHasCompletedOnboarding(false)
        setIsOnboardingReady(true)
        return
      }

      try {
        const storedValue = await AsyncStorage.getItem(`onboarding:${user.id}`)
        if (isMounted) {
          setHasCompletedOnboarding(storedValue === "true")
        }
      } catch (error) {
        console.log("Failed to load onboarding state", error)
        if (isMounted) {
          setHasCompletedOnboarding(false)
        }
      } finally {
        if (isMounted) {
          setIsOnboardingReady(true)
        }
      }
    }

    syncOnboardingState()

    return () => {
      isMounted = false
    }
  }, [user?.id])

  const completeOnboarding = async () => {
    if (!user?.id) return

    setHasCompletedOnboarding(true)

    try {
      await AsyncStorage.setItem(`onboarding:${user.id}`, "true")
    } catch (error) {
      console.log("Failed to save onboarding state", error)
    }
  }

  const logout = async () => {
    try {
      const isSignedIn = await GoogleSignin.hasPreviousSignIn()

      if (isSignedIn) {
        await GoogleSignin.signOut()
      }
    } catch (error) {
      console.log("Logout failed", error)
    } finally {
      setUser(null)
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

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
