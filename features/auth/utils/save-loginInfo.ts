import * as SecureStore from 'expo-secure-store';

export type User = {
  id: string;
  email: string;
  name: string;
  photo?: string;
};

export const saveLoginInfo = async (user: User) => {
  try {
    await SecureStore.setItemAsync(
      'user',
      JSON.stringify(user)
    );
  } catch (error) {
    console.log('Failed to save login info', error);
  }
};

export const getLoginInfo = async (): Promise<User | null> => {
  try {
    const data = await SecureStore.getItemAsync('user');

    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.log('Failed to get login info', error);
    return null;
  }
};

export const removeLoginInfo = async () => {
  try {
    await SecureStore.deleteItemAsync('user');
  } catch (error) {
    console.log('Failed to remove login info', error);
  }
};