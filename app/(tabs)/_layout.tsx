import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import useUserStore from "@/stores/userStore"; // Ajusta la ruta según la ubicación de tu store
import { RoleCodes } from "@/constants/roles"; // Ajusta la ruta según la estructura de constantes

export default function GeneralTabsLayout() {
  const router = useRouter();
  const { codigoRol } = useUserStore();

  useEffect(() => {
    // Redirige al layout correspondiente basado en el rol
    if (codigoRol === RoleCodes.Adoptante) {
      router.replace("/(tabs)/adoptante");
    } else if (codigoRol === RoleCodes.Rescatista) {
      router.replace("/(tabs)/rescatista");
    }
  }, [codigoRol, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Aquí no necesitamos especificar ninguna pantalla adicional */}
    </Stack>
  );
}
