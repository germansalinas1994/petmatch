import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar, View } from "react-native";
import Form from "@/components/pet-details/Form";
import CardPet from "@/components/pet-details/CardPet";
import FormEdit from "@/components/pet-details/FormEdit";
import { db } from "@/config/FirebaseConfig";
import { doc, collection, setDoc, getDocs, deleteDoc, query, where, updateDoc } from "firebase/firestore";
import userStore from "@/stores/userStore";
import { showMessage } from "react-native-flash-message";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Pet } from "@/types/index";
import Header from "@/components/Header";

export default function AddPet() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [petData, setPetData] = useState<Pet | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
        setPetData({ id: petDoc.id, ...petDoc.data() } as Pet);
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
        setPetData(null); // Reset petData to show the form
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


  const handleEditPet = () => {
    setIsEditing(true);
  };

  const onSubmit = async (data: Pet, reset: () => void) => {
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
      fetchPetData(); 
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

  // Handle saving updated pet data
  const onSave = async (data: Pet, reset: () => void) => {
    if (!idUser || !validToken() || !petData?.id) {
      showMessage({
        message: "Error",
        description: "No se pudo obtener el ID del usuario o de la mascota.",
        type: "danger",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const petRef = doc(db, "pets", petData.id); 
      const updatedPet = {
        ...data,
        user_id: idUser,
        images: data.images ?? [], 
      };

      await updateDoc(petRef, updatedPet); 

      showMessage({
        message: "Éxito",
        description: "La mascota ha sido actualizada correctamente.",
        type: "success",
      });

      reset(); 
      fetchPetData(); 
      setIsEditing(false); 
    } catch (error) {
      console.error("Error al actualizar la mascota:", error);
      showMessage({
        message: "Error",
        description: "Hubo un error al actualizar la mascota.",
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
      <Header title="Mascota" />
      {isEditing ? (
        <FormEdit
          petData={petData}
          onClose={() => setIsEditing(false)}
          handleSave={(data: Pet) => {

            onSave(data, () => {
              
              fetchPetData(); 
            });
          } }
          defaultValues={petData as Pet} onSubmit={function (data: Pet): void {
            throw new Error("Function not implemented.");
          } }        />
      ) : (
        isLoading ? (
          <LoadingIndicator />
        ) : petData ? (
          <CardPet
            name={petData.nombre}
            address={petData.direccion}
            type={petData.tipo}
            image={petData.images && petData.images.length > 0 ? petData.images[0] : undefined}
            onEdit={handleEditPet}
            onDelete={handleDeletePet}
          />
        ) : (
          <View>
            <Form onSubmit={onSubmit} />
          </View>
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : "auto",
    flex: 1,
  },
});
