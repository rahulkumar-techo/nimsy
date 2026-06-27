// uriToBlob.ts is no longer needed for this — replace the upload call directly.

import ReactNativeBlobUtil from "react-native-blob-util";

export async function uploadThumbnail(
  uri: string,
  presignedUrl: string,
  contentType: string,
): Promise<void> {
  const path = uri.startsWith("file://") ? uri.replace("file://", "") : uri;

  const response = await ReactNativeBlobUtil.fetch(
    "PUT",
    presignedUrl,
    {
      "Content-Type": contentType,
    },
    ReactNativeBlobUtil.wrap(path), // body — works here because blob-util's OWN fetch understands wrap(), no polyfill required
  );

  if (response.respInfo.status < 200 || response.respInfo.status >= 300) {
    throw new Error(
      `Thumbnail upload failed: ${response.respInfo.status} ${response.text()}`,
    );
  }
}