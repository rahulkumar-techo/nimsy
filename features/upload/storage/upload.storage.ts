/**
 * Upload Storage
 * MMKV-based persistence for upload sessions.
 * Enables resume-after-restart functionality.
 */

// FIX: Import 'createMMKV' instead of the legacy 'MMKV' class
import { createMMKV } from "react-native-mmkv";
import { UploadSession } from "../types/upload.types";

// FIX: Initialize instance via factory function instead of 'new MMKV'
const storage = createMMKV({
  id: "nimsy-upload-store",
});

const SESSION_KEY = "upload_session";

/**
 * Saves the upload session to MMKV storage.
 * Serializes session to survive app restarts.
 */
export function saveSession(session: UploadSession): void {
  storage.set(SESSION_KEY, JSON.stringify(session));
}

/**
 * Retrieves the persisted upload session from MMKV.
 * Returns null if no session exists or JSON is invalid.
 */
export function getSession(): UploadSession | null {
  const raw = storage.getString(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as UploadSession;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Removes the upload session from MMKV.
 * Called on successful completion or cancellation.
 */
export function removeSession(): void {
  // FIX: '.delete()' was changed to '.remove()' in v4 because 'delete' is a reserved word in C++
  storage.remove(SESSION_KEY);
}

/**
 * Checks if an upload session exists in storage.
 * Used to prevent concurrent uploads.
 */
export function hasSession(): boolean {
  return storage.contains(SESSION_KEY);
}