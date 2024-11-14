import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import UserForm from "@/components/profile/UserForm";
import LoadingIndicator from "@/components/Loading";
import { showMessage } from "react-native-flash-message";
import useRolesStore from "@/stores/rolesStore";
import useUserStore from "@/stores/userStore";
import { User } from "@/types/index";
import Header from "@/components/Header";

export default function EditProfile() {
  const { userId } = useLocalSearchParams();
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { roles } = useRolesStore();
  const { setName, setRol, setDescripcion } = useUserStore();

  useEffect(() => {
    if (userId) {
      fetchUserData(userId.toString());
    }
  }, [userId]);

  const fetchUserData = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        setUserData({
          nombre: data?.nombre || "",
          descripcion: data?.descripcion || "",
          rol_id: data?.rol_id || "",
          telefono: data?.telefono || "",
        } as User);
      } else {
        showMessage({
          message: "Error",
          description: "No se encontró el usuario.",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      showMessage({
        message: "Error",
        description: "Error al obtener datos del usuario.",
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };




  const handleUpdateUser = async (data: User, reset: () => void) => {
    setIsLoading(true);
    try {
      const userRef = doc(db, "users", userId as string); // Referencia al documento

      await setDoc(
        userRef,
        { ...data, updatedAt: new Date() },
        { merge: true }
      ); // Actualizar el hábito

      showMessage({
        message: "Éxito",
        description: "El usuario se ha actualizado correctamente.",
        type: "success",
      });

      reset(); // Resetear el formulario después de la actualización
      router.replace("/"); // Redirigir a la pantalla de Home
    } catch (error) {
      console.error("Error al actualizar el hábito:", error);
      showMessage({
        message: "Error",
        description: "Hubo un error al actualizar el hábito.",
        type: "danger",
      });
    } finally {
      setRol(data.rol_id);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBackButton={true} title="Editar perfil" />
      <UserForm
        onSubmit={handleUpdateUser}
        roles={roles}
        isLoading={false}
        defaultValues={userData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});