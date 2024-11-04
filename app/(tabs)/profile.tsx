import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, StatusBar, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { storage, db } from "@/config/FirebaseConfig";
import UserProfile from "@/components/profile/UserProfile";
import ProfileMenu from "@/components/profile/ProfileMenu";
import useUserStore from "@/stores/userStore";
import { useAuth0 } from "react-native-auth0";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { MenuItemAdoptante, MenuItemRescatista } from "@/constants/menuItemProfile";
import { RoleCodes } from "@/constants/roles";

export default function Profile() {
  const { nombre, imagen, mail, clearUser, codigoRol, idUser, setImagen } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const { clearSession } = useAuth0();
  const router = useRouter();

  const menuItems = codigoRol === RoleCodes.Rescatista ? MenuItemRescatista : MenuItemAdoptante;

  const onPressMenu = async (item : any) => {
    if (item.path === "logout") {
      try {
        await clearSession();
        clearUser();
        router.replace("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    } else if (item.path === "/profile/edit") {
      router.push({
        pathname: item.path,
        params: { userId: idUser },
      });
    } else {
      router.push(item.path);
    }
  };

  const pickImage = async () => {
    setIsLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImageToFirebase(uri);
    }
    setIsLoading(false);
  };

  const uploadImageToFirebase = async (uri : string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `users/${idUser}.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    if (idUser) {
      const userRef = doc(db, "users", idUser);
      await updateDoc(userRef, { imagen: downloadURL });
    }

    setImagen(downloadURL);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBackButton={false} title="Perfil" />
      <UserProfile
        name={nombre || "No hay nombre disponible"}
        imageUri={imagen}
        email={mail || "No hay correo disponible"}
        onPressImage={pickImage}
        isLoading={isLoading}
      />
      <ProfileMenu menuItems={menuItems} onPressMenu={onPressMenu} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
  },
});
