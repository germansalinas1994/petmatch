import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import LoadingIndicator from "../components/Loading"; // Ajusta la ruta según tu estructura de carpetas
import { Auth0Provider } from "react-native-auth0";
import FlashMessage from "react-native-flash-message";
import { View } from "react-native";

export default function RootLayout() {
  const domain: string | undefined = process.env.EXPO_PUBLIC_DOMAIN;
  const clientID: string | undefined = process.env.EXPO_PUBLIC_CLIENT_ID;

  // Cargar las fuentes
  const [fontsLoaded] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
  });

  // Si no hay configuración para Auth0, manejar el error de configuración
  if (!domain || !clientID) {
    console.error("Missing Auth0 configuration in environment variables");
    return null; // Devuelve null o maneja el error de otra manera
  }

  // Mostrar un indicador de carga mientras se cargan las fuentes
  if (!fontsLoaded) {
    return <LoadingIndicator />;
  } else {
    return (
      <Auth0Provider domain={domain} clientId={clientID}>
        {/* Asegúrate de que el Auth0Provider tenga un único hijo */}
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
          
          <FlashMessage position="top" />
        </View>
      </Auth0Provider>
    );
  }
}
