import { UploadSession } from "../../types/upload.types";
import * as uploadStorage from '../../storage/upload.storage';

export class PersistController {
  private lastPersistAt = 0;
  private completedSincePersist = 0;
  private readonly intervalMs: number;
  private readonly batchSize: number;

  constructor(opts: { intervalMs?: number; batchSize?: number } = {}) {
    this.intervalMs = opts.intervalMs ?? 5000;
    this.batchSize = opts.batchSize ?? 5;
  }

  /** Track successfully uploaded parts */
  markChunkCompleted() { this.completedSincePersist++; }

  /** Clear tracking metrics on a brand new or resumed upload cycle */
  reset() { this.lastPersistAt = 0; this.completedSincePersist = 0; }

  /** Evaluates and conditionally flushes session state to storage to prevent drive wear */
  persist(session: UploadSession | null, force = false): void {
    if (!session) return;

    const now = Date.now();
    // Throttling constraint check: Write if forced, batch ceiling is hit, or time threshold has elapsed
    const shouldPersist = force || 
      this.completedSincePersist >= this.batchSize || 
      (now - this.lastPersistAt >= this.intervalMs);

    if (!shouldPersist) return;

    uploadStorage.saveSession({ ...session, updatedAt: now });
    this.lastPersistAt = now;
    this.completedSincePersist = 0;
  }
}