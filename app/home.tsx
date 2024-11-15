import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useAuth0 } from "react-native-auth0";
import useUserStore from "@/stores/userStore";
import { db } from "@/config/FirebaseConfig";
import {
  doc,
  collection,
  setDoc,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import LoadingIndicator from "@/components/Loading";
import Form from "@/components/profile/UserForm";
import { showMessage } from "react-native-flash-message";
import useRolesStore from "@/stores/rolesStore";
import { useRouter } from "expo-router";
import { RoleCodes } from "@/constants/roles";
import { User } from "@/types/index";
import Header from "@/components/Header";

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
    setCodigoRol,
    setImagen,
    codigoRol,
  } = useUserStore();
  const { setRoles, roles } = useRolesStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);

  useEffect(() => {
    if (user && validToken()) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoaded(true);
    try {
      await handleUserCheck();
      if (roles.length === 0) {
        await getRoles();
      }
    } catch (error) {
      console.error("Error al obtener los roles:", error);
    } finally {
      setIsLoaded(false);
    }
  };

  const handleUserCheck = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("mail", "==", user?.email || ""));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      setIdUser(userDoc.id);
      const userData = userDoc.data();
      setShowRoleForm(!userData.rol_id);

      if (userData.rol_id) {
        await searchCodigoRol(userData.rol_id);
        
        setRol(userData.rol_id);
        setName(userData.nombre);
        setDescripcion(userData.descripcion);
        if(userData.imagen)
          setImagen(userData.imagen);
        console.log("User data:", userData);
      }
    }
  };

  const getRoles = async () => {
    setIsLoaded(true);
    try {
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
    } catch (error) {
      console.error("Error al obtener los roles", error);
    } finally {
      setIsLoaded(false);
    }
  };

  const searchCodigoRol = async (rol_id: string) => {
    setIsLoaded(true);
    try {
      const rolesRef = doc(db, "roles", rol_id);
      const docSnap = await getDoc(rolesRef);
      if (docSnap.exists()) {
        setCodigoRol(docSnap.data().codigo);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error al obtener el código del rol", error);
    } finally {
      setIsLoaded(false);
    }
  };

  const updateUserData = async (data: User) => {
    setIsLoaded(true);
    try {
      const userRef = doc(db, "users", idUser || "");
      await setDoc(userRef, data, { merge: true });
      setName(data.nombre);
      setDescripcion(data.descripcion);
    } catch (error) {
      console.error("Error al actualizar el usuario", error);
    } finally {
      setIsLoaded(false);
    }
  };

  const onSubmit = async (data: User, reset: () => void) => {
    setIsSubmitting(true);
    try {
      await updateUserData(data);
      setShowRoleForm(false);
      await searchCodigoRol(data.rol_id); // Asegura que codigoRol esté actualizado
      showMessage({
        message: "Usuario actualizado correctamente",
        type: "success",
      });
      reset();
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

  useEffect(() => {
    // Monitorea codigoRol para redirigir cuando esté listo
    if (codigoRol) {
      if (codigoRol === RoleCodes.Adoptante) {
        router.replace("/adoptante/find");
      } else if (codigoRol === RoleCodes.Rescatista) {
        router.replace("/(tabs)/rescatista");
      } else {
        router.replace("/");
      }
    }
  }, [codigoRol, router]);

  return (
    <View style={styles.container}>
      {isLoaded ? (
        <LoadingIndicator />
      ) : showRoleForm ? (
        <>
        <Header title="Registo de usuario" ></Header>
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
