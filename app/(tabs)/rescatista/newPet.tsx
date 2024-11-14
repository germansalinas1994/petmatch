import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  View,
} from "react-native";
import Form from "@/components/pet-details/Form";
import { db } from "@/config/FirebaseConfig";
import { doc, collection, setDoc, getDocs, updateDoc } from "firebase/firestore";
import userStore from "@/stores/userStore";
import { showMessage } from "react-native-flash-message"; // Importar Flash Message
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker"; // Importar Image Picker
import LoadingIndicator from "@/components/LoadingIndicator"; // Importar el componente de indicador de carga
interface PetFormData {
  nombre: string;
  description: string;
  direccion: string;
  edad: number;
  tipo: string;
  peso: number;
  sexo: string;
  images: string[];
}


export default function AddPet() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { validToken, idUser } = userStore();

  const onSubmit = async (data: PetFormData, reset: () => void) => {
    if (!idUser || !validToken()) {
      showMessage({
        message: "Error",
        description: "No se pudo obtener el ID del usuario.",
        type: "danger",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const petDoc = doc(collection(db, "pets")); // Crear referencia para un nuevo documento
      const newPet = {
        ...data,
        user_id: idUser, // asigna el id del usuario
        images: data.images ?? [], // Asigna las imágenes
        };
      await setDoc(petDoc, newPet);

      showMessage({
        message: "Éxito",
        description: "El hábito se ha guardado correctamente.",
        type: "success",
      });

      reset(); // Limpiar el formulario
    } catch (error) {
      console.error("Error al guardar el hábito:", error);
      showMessage({
        message: "Error",
        description: "Hubo un error al guardar el hábito.",
        type: "danger",
      });
    } finally {
      setIsSubmitting(false); 
      console.log("id", idUser);


    }
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      
        <View>
          <Form
            onSubmit={onSubmit} 
          />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
    flex: 1,
  },
});