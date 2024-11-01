import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useAuth0, User } from "react-native-auth0";
import useUserStore from "@/stores/userStore";
import { db } from "@/config/FirebaseConfig";
import {
  doc,
  collection,
  setDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import LoadingIndicator from "@/components/Loading";
import Form from "@/components/profile/UserForm";
import { showMessage } from "react-native-flash-message";
import useRolesStore from "@/stores/rolesStore";
import Header from "@/components/Header";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoading: isAuth0Loading } = useAuth0();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    validToken,
    setIdUser,
    setRol,
    idUser,
    setName,
    setDescripcion,
  } = useUserStore();
  const { setRoles, roles } = useRolesStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);

  useEffect(() => {
    if (user && validToken()) {
      fetchData();
    }
  }, [user]); // Solo se ejecuta cuando el usuario cambia

  const fetchData = async () => {
    setIsLoaded(true);
    try {
      await handleUserCheck();
      if (roles.length === 0) {
        getRoles();
      }
    } catch (error) {
      console.error("Error al obtener los roles:", error);
    } finally {
      setIsLoaded(false);
    }
  };

  const handleUserCheck = async () => {
    // Ahora simplemente asume que el usuario ya fue creado en Firestore
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("mail", "==", user?.email || ""));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      setIdUser(userDoc.id);
      const userData = userDoc.data();
      setShowRoleForm(!userData.rol_id);

      // Redirigir si el rol ya está configurado
      if (userData.rol_id) {
        setRol(userData.rol);
        setName(userData.nombre);
        setDescripcion(userData.descripcion);
        router.replace("/find");
      }
    }
  };

  const getRoles = async () => {
    const rolesRef = collection(db, "roles");
    const q = query(rolesRef);
    const querySnapshot = await getDocs(q);
    const rolesData = querySnapshot.docs.map((doc) => ({
      rol_id: doc.id,
      descripcion: doc.data().descripcion,
      codigo: doc.data().codigo,
      ...doc.data(),
    }));
    setRoles(rolesData);
  };

  const updateUserData = async (data: User) => {
    const userRef = doc(db, "users", idUser ? idUser : "");
    await setDoc(userRef, data, { merge: true });
    setRol(data.rol);
    setName(data.nombre);
    setDescripcion(data.descripcion);
  };

  const onSubmit = async (data: User, reset: () => void) => {
    setIsSubmitting(true);
    try {
      await updateUserData(data);
      setShowRoleForm(false);
      showMessage({
        message: "Usuario actualizado correctamente",
        type: "success",
      });
      reset();
      router.replace("/find");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      showMessage({
        message: "Error al actualizar el usuario",
        type: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoaded ? (
        <LoadingIndicator />
      ) : showRoleForm ? (
        <>
          <Header title="Registro de usuario" />
          <Form
            onSubmit={onSubmit}
            roles={roles}
            isLoading={roles.length === 0}
          />
        </>
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
