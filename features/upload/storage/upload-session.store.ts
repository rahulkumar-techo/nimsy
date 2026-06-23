// Persists upload sessions to disk so uploads can resume after an app
// restart or process death. MMKV is used for fast synchronous reads/writes —
// this is metadata only (ids, URLs, statuses), never video bytes.

import { createMMKV } from "react-native-mmkv";
import { PartStatus, PersistedPart, UploadSession } from "../types/session.types";
import { UploadPhase } from "../types/upload.types";

const storage =  createMMKV({ id: "upload-sessions" });

const keyFor = (videoId: string) => `session:${videoId}`;
const INDEX_KEY = "session-index";

function readIndex(): string[] {
  const raw = storage.getString(INDEX_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

function writeIndex(videoIds: string[]) {
  storage.set(INDEX_KEY, JSON.stringify(Array.from(new Set(videoIds))));
}

export const uploadSessionStore = {
  save(session: UploadSession): void {
    storage.set(keyFor(session.videoId), JSON.stringify(session));
    const index = readIndex();
    if (!index.includes(session.videoId)) writeIndex([...index, session.videoId]);
  },

  get(videoId: string): UploadSession | null {
    const raw = storage.getString(keyFor(videoId));
    return raw ? (JSON.parse(raw) as UploadSession) : null;
  },

  getAll(): UploadSession[] {
    return readIndex()
      .map((id) => uploadSessionStore.get(id))
      .filter((s): s is UploadSession => s !== null);
  },

  getIncomplete(): UploadSession[] {
    return uploadSessionStore.getAll().filter((s) => s.phase !== "COMPLETED" && s.phase !== "CANCELLED");
  },

  updatePart(videoId: string, partNumber: number, patch: Partial<PersistedPart>): UploadSession | null {
    const session = uploadSessionStore.get(videoId);
    if (!session) return null;

    session.parts = session.parts.map((p) => (p.partNumber === partNumber ? { ...p, ...patch } : p));
    session.updatedAt = Date.now();
    uploadSessionStore.save(session);
    return session;
  },

  setPhase(videoId: string, phase: UploadPhase): void {
    const session = uploadSessionStore.get(videoId);
    if (!session) return;
    session.phase = phase;
    session.updatedAt = Date.now();
    uploadSessionStore.save(session);
  },

  setPartStatus(videoId: string, partNumber: number, status: PartStatus): void {
    uploadSessionStore.updatePart(videoId, partNumber, { status });
  },

  remove(videoId: string): void {
    storage.remove(keyFor(videoId));
    writeIndex(readIndex().filter((id) => id !== videoId));
  },
};
