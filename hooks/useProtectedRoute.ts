// hooks/useProtectedRoute.ts
import { useEffect } from "react";
import { useRouter } from "expo-router";
import useUserStore from "@/stores/userStore";

export const useProtectedRoute = (requiredRole: string) => {
  const { codigoRol, isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/"); // Redirige si el usuario no está autenticado
    } else if (codigoRol !== requiredRole) {
      router.replace("/"); // Redirige si el rol no coincide
    }
  }, [codigoRol, isAuthenticated]);
};
