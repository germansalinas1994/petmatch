import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useAuth0, User } from "react-native-auth0";
import useUserStore from "@/stores/userStore";
import { db } from "@/config/FirebaseConfig";
import {
  doc,
  collection,
  setDoc,
  where,
  getDocs,
  query,
} from "firebase/firestore";
import LoadingIndicator from "@/components/Loading";
import Form from "@/components/profile/UserForm";
import { showMessage } from "react-native-flash-message"; // Importar Flash Message
import useRolesStore from "@/stores/rolesStore";
import Header from "@/components/Header";

export default function HomeScreen() {
  const { user } = useAuth0();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setEmail, validToken, setIdUser, token, setRol, email, idUser } =
    useUserStore();
  const { setRoles, roles } = useRolesStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);

  // Carga inicial del usuario una vez que se valida el token
  useEffect(() => {
    if (token && validToken() && !isLoaded) {
      setIsLoaded(true);
      handleUserCheck();
    }
  }, [token]);

  // Carga inicial de roles solo una vez al montar el componente
  useEffect(() => {
    if (!roles.length) {
      getRoles();
    }
  }, []);

  const handleUserCheck = async () => {
    try {
      await getAccessToken();
    } catch (error) {
      console.error("Error al obtener el token o las categorías:", error);
    } finally {
      setIsLoaded(false);
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

  const getAccessToken = async () => {
    if (validToken()) {
      await checkOrCreateUser(email || "");
    } else {
      throw new Error("El token no es válido");
    }
  };

  const checkOrCreateUser = async (email: string) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("mail", "==", email));
    const querySnapshot = await getDocs(q);

    console.log(querySnapshot);

    if (querySnapshot.empty) {
      const newUser = doc(usersRef);
      await setDoc(newUser, {
        email: email,
        createdAt: new Date(),
      });
      setIdUser(newUser.id);
      setShowRoleForm(true);
    } else {
      const userDoc = querySnapshot.docs[0];
      setIdUser(userDoc.id);
      const userData = userDoc.data();
      setShowRoleForm(!userData.rol_id);
      setRol(userData.rol);
    }
    setEmail(email);
  };

  const onSubmit = async (data: User, reset: () => void) => {
    setIsSubmitting(true);
    try {
      const userRef = doc(db, "users", idUser ? idUser : ""); // Usa el ID del usuario actual
      await setDoc(userRef, data, { merge: true }); // Actualiza los datos del usuario en Firestore
      setShowRoleForm(false); // Oculta el formulario una vez actualizado
      showMessage({
        message: "Usuario actualizado correctamente",
        type: "success",
      });
      reset(); // Reinicia el formulario
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
