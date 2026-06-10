/**
 * Authentication Storage Utility
 * Stores tokens securely and user profile locally
 */

import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "auth_user",
} as const

export interface User {
  id: string
  name: string
  email: string
  photo?: string
  username?: string
  avatarUrl?: string | null
  hasCompletedOnboarding:boolean
}

export interface AuthData {
  accessToken: string
  refreshToken: string
}

class AuthStorage {
  /** Save full auth session */
  async save(data: AuthData): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken),
      SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken),
      // AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user)),
    ])
  }

  /** Update tokens only (e.g. after refresh) */
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
      SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    ])
  }

  /** Update user profile only */
  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN)
  }

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN)
  }

  async getUser(): Promise<User | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER)
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  }

  /** Returns full session or null if any piece is missing */
  async getSession(): Promise<AuthData | null> {
    const [accessToken, refreshToken, user] = await Promise.all([
      this.getAccessToken(),
      this.getRefreshToken(),
      this.getUser(),
    ])

    if (!accessToken || !refreshToken || !user) return null

    return { accessToken, refreshToken }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken()
    return Boolean(token)
  }

  async clearUser(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER)
  }

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
    ])
  }

  /** Wipe entire session */
  async clear(): Promise<void> {
    await Promise.all([this.clearTokens(), this.clearUser()])
  }
}

export const authStorage = new AuthStorage()