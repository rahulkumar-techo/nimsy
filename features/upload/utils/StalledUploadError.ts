export class StalledUploadError extends Error {
  constructor(partNumber: number) {
    super(`Upload stalled for part ${partNumber}`);
    this.name = "StalledUploadError";
  }
}