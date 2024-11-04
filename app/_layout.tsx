import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import LoadingIndicator from "../components/Loading"; 
import { Auth0Provider } from "react-native-auth0";
import FlashMessage from "react-native-flash-message";
import { View } from "react-native";
import { useEffect } from "react";
import useUserStore from "@/stores/userStore";
import { RoleCodes } from "@/constants/roles";

export default function RootLayout() {
  const router = useRouter();
  const { codigoRol } = useUserStore();
  const domain: string | undefined = process.env.EXPO_PUBLIC_DOMAIN;
  const clientID: string | undefined = process.env.EXPO_PUBLIC_CLIENT_ID;

  // Cargar las fuentes
  const [fontsLoaded] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
  });

  // Verificar configuración de Auth0
  if (!domain || !clientID) {
    console.error("Missing Auth0 configuration in environment variables");
    return null;
  }

  // Mostrar indicador de carga mientras se cargan las fuentes
  if (!fontsLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <Auth0Provider domain={domain} clientId={clientID}>
      <View style={{ flex: 1 }}>
        <RoleRedirect codigoRol={codigoRol != null ? codigoRol : ""} router={router} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
        <FlashMessage position="top" />
      </View>
    </Auth0Provider>
  );
}

function RoleRedirect({ codigoRol, router }: { codigoRol: string | undefined; router: any }) {
  useEffect(() => {
    if (codigoRol === RoleCodes.Adoptante) {
      router.replace("/(tabs)/adoptante");
    } else if (codigoRol === RoleCodes.Rescatista) {
      router.replace("/(tabs)/rescatista");
    }
  }, [codigoRol, router]);

  return null;
}
