// @/lib/media.ts
const CDN_BASE_URL =
  process.env.EXPO_PUBLIC_AWS_CDN ??
  process.env.EXPO_PUBLIC_CDN_BASE_URL ??
  "https://d1ka3d3043mwk5.cloudfront.net";

const normalizedCdnBaseUrl = CDN_BASE_URL.trim().replace(/\/+$/, "");

/**
 * Turns an S3 object key like "videos/<id>/thumbnail.jpg"
 * into a fully-qualified CDN/S3 URL.
 */
export function getMediaUrl(key: string | null | undefined): string | undefined {
  const value = key?.trim();

  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;

  return `${normalizedCdnBaseUrl}/${value.replace(/^\/+/, "")}`;
}
