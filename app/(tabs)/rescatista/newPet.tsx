import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar, View } from "react-native";
import Form from "@/components/pet-details/Form";
import CardPet from "@/components/pet-details/CardPet";
import { db } from "@/config/FirebaseConfig";
import { doc, collection, setDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";
import userStore from "@/stores/userStore";
import { showMessage } from "react-native-flash-message";
import LoadingIndicator from "@/components/LoadingIndicator";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [petData, setPetData] = useState<PetFormData | null>(null);
  const { validToken, idUser } = userStore();

  useEffect(() => {
    if (idUser) {
      fetchPetData();
    }
  }, [idUser]);

  const fetchPetData = async () => {
    setIsLoading(true);
    try {
      const petsQuery = query(collection(db, "pets"), where("user_id", "==", idUser));
      const querySnapshot = await getDocs(petsQuery);
      if (!querySnapshot.empty) {
        const petDoc = querySnapshot.docs[0];
        setPetData({ id: petDoc.id, ...petDoc.data() } as PetFormData);
      } else {
        setPetData(null);
      }
    } catch (error) {
      console.error("Error al obtener datos de la mascota:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePet = async () => {
    if (petData && petData.id) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, "pets", petData.id));
        showMessage({
          message: "Mascota eliminada",
          description: "La mascota ha sido eliminada correctamente.",
          type: "success",
        });
        setPetData(null); // Restablece petData para mostrar el formulario
      } catch (error) {
        console.error("Error al eliminar la mascota:", error);
        showMessage({
          message: "Error",
          description: "No se pudo eliminar la mascota.",
          type: "danger",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

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
      const petDoc = doc(collection(db, "pets"));
      const newPet = {
        ...data,
        user_id: idUser,
        images: data.images ?? [],
      };
      await setDoc(petDoc, newPet);

      showMessage({
        message: "Éxito",
        description: "La mascota se ha guardado correctamente.",
        type: "success",
      });

      reset();
      fetchPetData(); // Refresca los datos de la mascota después de guardarla
    } catch (error) {
      console.error("Error al guardar la mascota:", error);
      showMessage({
        message: "Error",
        description: "Hubo un error al guardar la mascota.",
        type: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {petData ? (
        <CardPet
          name={petData.nombre}
          address={petData.direccion}
          type={petData.tipo}
          image={petData.images && petData.images.length > 0 ? petData.images[0] : undefined}
          onEdit={() => {}}
          onDelete={handleDeletePet}
        />
      ) : (
        <View>
          <Form onSubmit={onSubmit} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
    flex: 1,
  },
});
