import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Directory,
  File,
  Paths,
} from 'expo-file-system';

const DOWNLOAD_KEY = 'downloads';

/* ---------------- DOWNLOAD VIDEO ---------------- */

export const downloadVideo = async (
  id: string,
  videoUrl: string,
  title: string
) => {
  try {
    // create folder
    const downloadsDir = new Directory(
      Paths.document,
      'file-downloads'
    );

    if (!downloadsDir.exists) {
      downloadsDir.create();
    }

    // create file
    const file = new File(
      downloadsDir,
      `${id}.mp4`
    );

    // download file
    const downloadedFile = await File.downloadFileAsync(
      videoUrl,
      file
    );

    // get old downloads
    const existing = await AsyncStorage.getItem(
      DOWNLOAD_KEY
    );

    const downloads = existing
      ? JSON.parse(existing)
      : [];

    // prevent duplicate
    const alreadyExists = downloads.find(
      (item: any) => item.id === id
    );

    if (alreadyExists) {
      return alreadyExists;
    }

    const newItem = {
      id,
      title,
      localPath: downloadedFile.uri,
      downloadedAt: new Date().toISOString(),
    };

    downloads.push(newItem);

    // save
    await AsyncStorage.setItem(
      DOWNLOAD_KEY,
      JSON.stringify(downloads)
    );

    return newItem;
  } catch (error) {
    console.log('Download Error:', error);
    return null;
  }
};

/* ---------------- GET DOWNLOADS ---------------- */

export const getDownloads = async () => {
  try {
    const data = await AsyncStorage.getItem(
      DOWNLOAD_KEY
    );

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

/* ---------------- DELETE DOWNLOAD ---------------- */

export const deleteDownload = async (
  id: string
) => {
  try {
    // get downloads
    const existing = await AsyncStorage.getItem(
      DOWNLOAD_KEY
    );

    const downloads = existing
      ? JSON.parse(existing)
      : [];

    // find item
    const item = downloads.find(
      (v: any) => v.id === id
    );

    // delete physical file
    if (item?.localPath) {
      const file = new File(item.localPath);

      if (file.exists) {
        file.delete();
      }
    }

    // remove from array
    const updatedDownloads = downloads.filter(
      (v: any) => v.id !== id
    );

    // update storage
    await AsyncStorage.setItem(
      DOWNLOAD_KEY,
      JSON.stringify(updatedDownloads)
    );

    return true;
  } catch (error) {
    console.log('Delete Error:', error);
    return false;
  }
};

/* ---------------- CHECK EXISTS ---------------- */

export const isDownloaded = async (
  id: string
) => {
  try {
    const downloads = await getDownloads();

    return downloads.some(
      (item: any) => item.id === id
    );
  } catch (error) {
    console.log(error);
    return false;
  }
};