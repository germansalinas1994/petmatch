import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator, Text } from "react-native";
import Colors from "../constants/Colors";
import LoadingIndicator from "../components/Loading"; // Ajusta la ruta según tu estructura de carpetas

export default function RootLayout() {
  // Cargar las fuentes
  const [fontsLoaded] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
  });

  // Mostrar un indicador de carga mientras se cargan las fuentes
  if (!fontsLoaded) {
    return <LoadingIndicator />;
  } else {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    );
  }
}
