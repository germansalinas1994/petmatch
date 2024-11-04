// Profile.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  StatusBar,
  Platform,
  Text,
} from "react-native";
import UserProfile from "@/components/profile/UserProfile";
import ProfileMenu from "@/components/profile/ProfileMenu";
import useUserStore from "@/stores/userStore";
import { useAuth0 } from "react-native-auth0";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "@/components/Header";
import {
  MenuItemAdoptante,
  MenuItemRescatista,
} from "@/constants/menuItemProfile";
import { RoleCodes } from "@/constants/roles";
import { MenuItem } from "@/types/index";

export default function Profile() {
  const { nombre, imagen, mail, clearUser, codigoRol } = useUserStore();
  const { clearSession } = useAuth0();
  const router = useRouter();

  const menuItems: MenuItem[] =
    codigoRol === RoleCodes.Rescatista ? MenuItemRescatista : MenuItemAdoptante;

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
