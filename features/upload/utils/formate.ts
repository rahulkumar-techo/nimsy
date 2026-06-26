// utils/format.ts

/**
 * Formats a byte count into a human-readable string (e.g. "1.5 MB").
 * Uses 1024-based units (KB, MB, GB, ...) and clamps to 0 B for invalid input.
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, exponent);
  const formatted = exponent === 0 ? value.toString() : value.toFixed(decimals);

  return `${formatted} ${units[exponent]}`;
}