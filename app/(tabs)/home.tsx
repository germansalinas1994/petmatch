import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useAuth0 } from "react-native-auth0";
import useUserStore from "@/stores/userStore";
import { db } from "@/config/FirebaseConfig";
import { doc, collection, setDoc, where, getDocs, query } from "firebase/firestore";
import LoadingIndicator from "@/components/Loading";

export default function HomeScreen() {
  const { user, authorize } = useAuth0();
  const { setEmail, validToken, setIdUser, token, email } = useUserStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);

  useEffect(() => {
    if (token && validToken()) {
      handleUserCheck();
    }
  }, [token]);

  const handleUserCheck = async () => {
    setIsLoaded(true);
    try {
      await getAccessToken();
    } catch (error) {
      console.error("Error al obtener el token o las categorías:", error);
    } finally {
      setIsLoaded(false);
    }
  };

  const getAccessToken = async () => {
    if (validToken()) {
      await checkOrCreateUser(user?.email || "", { name: user?.name || "" });
    } else {
      throw new Error("El token no es válido");
    }
  };

  const checkOrCreateUser = async (email: string, userData: { name: string }) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Si el usuario no existe, crearlo y mostrar el formulario para configurar el rol
      const newUser = doc(usersRef);
      await setDoc(newUser, {
        email: email,
        name: userData.name,
        createdAt: new Date(),
      });
      setIdUser(newUser.id);
      setShowRoleForm(true); // Muestra el formulario si el usuario no tiene rol
    } else {
      const userDoc = querySnapshot.docs[0];
      setIdUser(userDoc.id);
      const userData = userDoc.data();
      setShowRoleForm(!userData.role); // Muestra el formulario si el usuario no tiene rol
    }
    setEmail(email);
  };

  return (
    <View style={styles.container}>
      {isLoaded ? (
        <LoadingIndicator />
      ) : showRoleForm ? (
        <></> // Renderiza el formulario aquí
      ) : (
        <Text>¡Bienvenido! Ir a la pantalla de find o lo que necesites mostrar aquí.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
