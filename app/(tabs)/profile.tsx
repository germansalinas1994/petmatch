// Profile.tsx
import React from "react";
import { SafeAreaView, View, StyleSheet, StatusBar, Platform, Text } from "react-native";
import UserProfile from "@/components/profile/UserProfile";
import ProfileMenu from "@/components/profile/ProfileMenu";
import useUserStore from "@/stores/userStore";
import { useAuth0 } from "react-native-auth0";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "@/components/Header";

interface MenuItem {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap; // Tipamos icon para que solo acepte íconos válidos
  path: string;
}

export default function Profile() {
  const { nombre, imagen, mail, clearUser, codigoRol } = useUserStore();
  const { clearSession } = useAuth0();
  const router = useRouter();



  const menuItems: MenuItem[] = [
    { id: 1, name: "Configurar", icon: "settings", path: "/change-profile" },
    { id: 2, name: "Ver mascotas", icon: "list", path: "/(tabs)/adoptante/find" },
    { id: 3, name: "Cerrar sesión", icon: "exit", path: "logout" },
  ];

  const onPressMenu = async (item: any) => {
    if (item.path === "logout") {
      try {
        await clearSession();
        clearUser();
        router.replace("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    } else {
      router.push(item.path as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <Header showBackButton={false} title="Perfil" />
        <UserProfile
          name={nombre || "No hay nombre disponible"}
          imageUri={imagen}
          email={mail || "No hay correo disponible"}
        />
        <ProfileMenu menuItems={menuItems} onPressMenu={onPressMenu} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "outfit-medium",
    fontWeight: "bold",
  },
});
