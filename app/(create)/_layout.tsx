import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function CreateLayout() {
  return (
    <>
      <StatusBar
        // style="light"
        barStyle={"light-content"}
        translucent={false}
        backgroundColor="#000"
      />
      <Stack
        screenOptions={{
          headerShown: false,
          statusBarTranslucent: false,
        }} />
    </>


  );
}