// Top-level orchestrator for the upload feature. Stubbed out to avoid
// native-module crashes on web / dev environments.

// import { initUpload } from "../api/init-upload";
// import { completeUpload } from "../api/complete-upload";
// import { abortUpload } from "../api/abort-upload";
import { initUpload } from "../api/init-upload";
import { UploadMetadata, UploadProgressCallback } from "../types/upload.types";

export const uploadManager = {



  async startUpload(_sourceFilePath: string, _metadata: UploadMetadata, onUpdate?: UploadProgressCallback) {
    // Initializing video to get presigned urls 
    onUpdate?.(0, "INITIALIZING", "Preparing upload...");
    const init = await initUpload(_metadata);

    // upload multiple data but before sending multiple data slice the video
    console.log("[uploadManager] startUpload stubbed");
    return { videoId: "stubbed-video-id", parts: [] };
  },

  async cancelUpload(_videoId: string): Promise<void> {
    console.log("[uploadManager] cancelUpload stubbed");
  },
};


/*
Step 1: User selects video
        ↓
Store locally in Redux/local state
Generate local preview
Extract duration, size, thumbnail locally
(NO backend call)

Step 2: User fills metadata
        ↓
Title
Description
Visibility
Made for kids
Chapters
Thumbnail

Step 3: User presses "Upload/Publish"
        ↓
POST /videos/upload/init

Backend:
- Validate metadata
- Create DB record (status = UPLOADING)
- Create Multipart Upload in S3
- Calculate chunk size
- Generate presigned URLs
- Save upload session
- Return:
    uploadId
    videoId
    chunkSize
    totalParts
    presignedUrls[]

Step 4: Frontend uploads chunks to S3
        ↓
Parallel upload (3-5 concurrent)
Retry failed chunks
Track progress
Store uploaded parts + ETags

Step 5: All chunks uploaded
        ↓
POST /videos/upload/complete

Backend:
- Verify all expected parts exist
- CompleteMultipartUpload
- Mark DB status = PROCESSING

Step 6:
Background jobs
FFmpeg
Thumbnail generation
Transcoding
AI moderation
etc.

Step 7:
status = READY

*/ 