# Nimsy Upload System

A production-grade, memory-efficient, resumable multipart upload system for React Native + Expo applications.

Designed for:

- Large video uploads (100 MB → 5 GB+)
- AWS S3 Multipart Upload
- Poor mobile networks
- Pause / Resume
- Upload persistence
- Automatic recovery
- Low memory usage
- Production reliability

---

# Features

✅ AWS S3 Multipart Upload

✅ Native chunk generation

✅ Zero-copy streaming uploads

✅ Memory-efficient

✅ Automatic retries

✅ Resume support

✅ Upload persistence

✅ Dynamic concurrency

✅ Chunk integrity validation

✅ Automatic presigned URL refresh

✅ Stalled upload detection

✅ Progress aggregation

✅ Upload notifications

✅ Session recovery

---
## upload manager is  quite robust. At this point,implemented:

✅ Multipart uploads

✅ Native chunk slicing

✅ Dynamic concurrency

✅ Retry with exponential backoff

✅ Session persistence

✅ Pause / Resume

✅ Cancel

✅ Network recovery

✅ Progress throttling

✅ Active worker tracking

✅ In-flight bytes tracking

✅ Automatic URL refresh

✅ Chunk integrity validation

---

---

# High-Level Architecture

```text
User Selects Video
        ↓
Initialize Multipart Upload Session
        ↓
UploadManager Creates Upload Queue
        ↓
Worker Pool Processes Queue
        ↓
Chunk File Created Natively
        ↓
Integrity Validation
        ↓
UploadWorker Streams Chunk To S3
        ↓
ETag Captured
        ↓
Persist Session State
        ↓
Delete Temporary Chunk
        ↓
Repeat Until Complete
        ↓
Complete Multipart Upload
```

---

# Directory Structure

```text
src/upload/

├── manager/
│   ├── upload.manager.ts
│   ├── persist.controller.ts
│   └── concurrency.controller.ts
│
├── service/
│   ├── upload.worker.ts
│   └── upload-notification.service.ts
│
├── storage/
│   └── upload.storage.ts
│
├── utils/
│   ├── chunk-file.util.ts
│   └── chunk-integrity.util.ts
│
├── services/
│   └── upload.api.ts
│
└── types/
    └── upload.types.ts
```

---

# Core Components

# 1. UploadManager

File:

```text
manager/upload.manager.ts
```

The UploadManager orchestrates the entire upload lifecycle.

Responsibilities:

- create upload queue
- manage worker pool
- manage retries
- pause uploads
- resume uploads
- cancel uploads
- persist session
- aggregate progress
- complete multipart upload

UploadManager is the central brain.

---

## Lifecycle

```text
start()
    ↓
create queue
    ↓
spawn workers
    ↓
upload chunks
    ↓
flush etags
    ↓
complete upload
```

---

# Public API

```ts
start()
resume()
pause()
cancel()
status()
```

---

# Internal Helpers

## uploadChunk()

Responsible for uploading a single chunk.

Workflow:

```text
resolveChunk()
        ↓
UploadWorker.run()
        ↓
capture ETag
        ↓
cleanup chunk
```

---

## resolveChunk()

Responsible for:

```text
1. create chunk
2. validate integrity
3. recreate corrupted chunk
```

Workflow:

```text
cache hit?
      ↓
yes → reuse chunk
no  → create chunk
      ↓
validate
      ↓
valid?
      ↓
yes → upload
no  → recreate
```

---

## refreshChunkUrl()

Used when S3 returns:

```text
HTTP 403
ExpiredToken
Request has expired
SignatureDoesNotMatch
```

Workflow:

```text
Chunk upload fails
       ↓
Request fresh presigned URL
       ↓
Update session
       ↓
Retry chunk
```

---

# 2. UploadWorker

File:

```text
service/upload.worker.ts
```

Responsible for:

- upload single chunk
- emit progress
- detect stalls
- stream file natively

UploadWorker does NOT:

- create chunks
- manage queue
- persist state

Those responsibilities belong to UploadManager.

---

## Upload Flow

```text
verify file exists
        ↓
verify file size
        ↓
stream chunk using BlobUtil
        ↓
receive progress
        ↓
extract ETag
        ↓
return success
```

---

## Zero-Copy Upload

Chunks are never loaded into JS memory.

Implementation:

```text
ReactNativeBlobUtil.wrap(filePath)
```

This streams bytes directly from disk to network.

Benefits:

```text
Very low memory usage
Supports huge files
Prevents JS crashes
```

---

# 3. Chunk Creation

File:

```text
utils/chunk-file.util.ts
```

Responsibilities:

```text
createChunkFile()
deleteChunkFile()
cleanupChunks()
```

Workflow:

```text
Original Video
       ↓
Native Slice
       ↓
Temporary Chunk File
```

Example:

```text
cache/upload-123/part-7.tmp
```

---

# 4. Chunk Integrity

File:

```text
utils/chunk-integrity.util.ts
```

Responsible for validating chunk correctness.

Validation:

```ts
exists?
size === expectedSize?
```

Workflow:

```text
Chunk Created
      ↓
Validate
      ↓
Corrupted?
      ↓
yes → recreate
no  → upload
```

This protects against:

- Android cache cleanup
- corrupted chunk generation
- incomplete writes

---

# 5. Dynamic Concurrency

File:

```text
manager/concurrency.controller.ts
```

Determines optimal parallel uploads.

Inputs:

```text
RAM
Network Type
Charging State
```

Example:

| Condition | Workers |
|-----------|---------|
| RAM < 3GB | 2 |
| RAM 3-6GB | 3 |
| RAM > 6GB | 4 |
| High RAM + WiFi + Charging | 5 |

Purpose:

```text
maximize speed
minimize memory pressure
prevent battery drain
```

---

# 6. Persistence Controller

File:

```text
manager/persist.controller.ts
```

Responsible for throttled persistence.

Avoids:

```text
saving session after every chunk
```

Persistence occurs:

```text
every 5 chunks
OR
every 5 seconds
OR
critical state changes
```

Critical states:

```text
PAUSED
FAILED
COMPLETED
CANCELLED
```

---

# 7. Upload Storage

File:

```text
storage/upload.storage.ts
```

Persists upload session.

Example storage:

```ts
UploadSession {
    uploadId
    videoId
    key
    uploadedParts
    status
}
```

Used for:

```text
resume uploads
crash recovery
app restart recovery
```

---

# Upload Session Lifecycle

```text
INITIATED
      ↓
UPLOADING
      ↓
PAUSED
      ↓
RESUMED
      ↓
COMPLETING
      ↓
COMPLETED
```

Failure path:

```text
UPLOADING
      ↓
FAILED
```

---

# Retry Strategy

Current policy:

```text
Max retries = 2
```

Retry triggers:

```text
ExpiredToken
HTTP 403
SignatureDoesNotMatch
Request has expired
StalledUploadError
```

No retry:

```text
HTTP 400
HTTP 404
Missing ETag
```

---

# Stalled Upload Detection

Implemented inside:

```text
UploadWorker
```

Rule:

```text
No progress for 60 seconds
```

Workflow:

```text
No progress
      ↓
Cancel request
      ↓
Throw StalledUploadError
      ↓
Retry chunk
```

Prevents:

```text
hung TCP sockets
dead mobile connections
infinite uploads
```

---

# Chunk Cleanup Policy

Chunk files are deleted:

```text
✓ upload success
✓ final retry failure
✓ upload cancellation
```

Chunks are NOT deleted:

```text
during retries
```

This minimizes disk IO.

---

# Progress Aggregation

Each worker reports:

```ts
uploadedBytes
totalBytes
```

UploadManager aggregates:

```text
sum(all uploaded bytes)
```

Result:

```ts
overallProgress = uploadedBytes / totalBytes
```

This drives:

```text
UI Progress Bar
Redux State
Notifications
```

---

# Notifications

File:

```text
service/upload-notification.service.ts
```

Displays:

```text
Uploading...
Paused
Failed
Completed
```

Current implementation works while app process remains alive.

Future upgrade:

```text
Foreground Service
WorkManager
```

---

# Memory Characteristics

This architecture never loads the full file into memory.

Memory pattern:

```text
Original File
       ↓
Native Chunk File
       ↓
Disk → Network Stream
       ↓
Delete Chunk
```

Approximate JS memory:

```text
10 MB - 30 MB
```

even for multi-GB uploads.

---

# Failure Recovery

Supports:

✅ network loss

✅ presigned URL expiration

✅ app restart

✅ chunk corruption

✅ upload pause

✅ upload resume

✅ stalled connections

---

# Future Improvements

- Android Foreground Service
- WorkManager integration
- Native Expo Upload Module
- Upload speed estimation
- ETA calculation
- Exponential backoff
- Analytics
- Background uploads after process death

---

# Design Principles

1. Keep JS memory low.
2. Prefer disk over RAM.
3. Recover automatically whenever possible.
4. Never trust temporary files.
5. Persist important state.
6. Minimize network calls.
7. Fail fast, recover gracefully.

---

# Upload Flow Diagram

```text
start()
   ↓
create queue
   ↓
worker pool
   ↓
resolveChunk()
   ↓
validate chunk
   ↓
UploadWorker
   ↓
S3 PUT
   ↓
ETag
   ↓
persist
   ↓
cleanup chunk
   ↓
all parts uploaded?
   ↓
yes
   ↓
complete multipart upload
   ↓
COMPLETED
```

---

# License

Internal Nimsy Upload Infrastructure.