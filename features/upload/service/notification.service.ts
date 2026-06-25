// services/upload-notification.service.ts

import * as Notifications from "expo-notifications";

export class UploadNotificationService {
  private static notificationId: string | null = null;

  static async initialize() {
    await Notifications.setNotificationChannelAsync(
      "uploads",
      {
        name: "Uploads",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0],
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      }
    );
  }

  static async showProgress(
    progress: number
  ) {
    await Notifications.scheduleNotificationAsync({
      identifier: "upload-progress",
      content: {
        title: "Uploading Video",
        body: `${progress.toFixed(0)}% completed`,
        sticky: true,
      },
      trigger: null,
    });
  }

  static async showCompleted() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upload Complete",
        body: "Your video has been uploaded.",
      },
      trigger: null,
    });
  }

  static async showFailed() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upload Failed",
        body: "Tap to retry upload.",
      },
      trigger: null,
    });
  }
}