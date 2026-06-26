// services/upload-notification.service.ts

import * as Notifications from "expo-notifications";

export class UploadNotificationService {
    private static notificationId: string | null = null;

    static async initialize() {

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldPlaySound: false,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });


        await Notifications.setNotificationChannelAsync(
            "uploads",
            {
                name: "Uploads",
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0],
                lockscreenVisibility:
                    Notifications.AndroidNotificationVisibility.PUBLIC,
            },

        );

        await Notifications.setNotificationChannelAsync(
            "uploads-progress",
            {
                name: "Upload Progress",
                importance: Notifications.AndroidImportance.LOW,
                vibrationPattern: [0],
                lockscreenVisibility:
                    Notifications.AndroidNotificationVisibility.PRIVATE,
            },
        );


    }

    static async showProgress(
        progress: number
    ) {
        if (this.notificationId) {
            await Notifications.dismissNotificationAsync(this.notificationId);
        }
        this.notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Uploading Video",
                body: `${progress}% completed`,
                sticky: true,
            },
            trigger: null,
        });
    }

    static async showCompleted() {
        if (this.notificationId) {
            await Notifications.dismissNotificationAsync(this.notificationId);
            this.notificationId = null;
        }
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Upload Complete",
                body: "Your video has been uploaded.",
            },
            trigger: null,
        });
    }

    static async showFailed() {
        if (this.notificationId) {
            await Notifications.dismissNotificationAsync(this.notificationId);
            this.notificationId = null;
        }
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Upload Failed",
                body: "Tap to retry upload.",
            },
            trigger: null,
        });
    }
}