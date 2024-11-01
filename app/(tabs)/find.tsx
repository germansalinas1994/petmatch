import {
  View,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Buttons from "@/components/find/Buttons";
import AnimatedEffect from "@/components/find/AnimatedEffect";
import { db } from "../../config/FirebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Pet } from "@/types";
// import { Image } from "react-native-expo-image-cache";
import SkeletonItem from "@/components/SkeletonItem";
import PetList from "@/components/find/PetsList";
import NotFindPets from "@/components/find/NotFindPets";
import { usePetStore } from "@/stores/petStore";
import { useProtectedRoute } from "@/hooks/useProtectedRoute"; // Importa el hook
import { RoleCodes } from "@/constants/roles"; // Importa los códigos de roles


export default function Find() {
  useProtectedRoute(RoleCodes.Adoptante);


  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showDislikeAnimation, setShowDislikeAnimation] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [evaluatedPetIds, setEvaluatedPetIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);
  const hardcodedUserId = "aBzu53nnGyivWW1KDq95";
  const setSelectedPet = usePetStore((state) => state.setSelectedPet);

  useEffect(() => {
    const userQuery = query(
      collection(db, "user_pets_likes_dislikes"),
      where("user_id", "==", hardcodedUserId)
    );

    const unsubscribe = onSnapshot(userQuery, (snapshot) => {
      //me quedo con los ids de las mascotas evaluadas
      const newEvaluatedIds = new Set<string>(
        snapshot.docs.map((doc) => doc.data().pet_id)
      );
      setEvaluatedPetIds(newEvaluatedIds);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pets"), (snapshot) => {
      const newPets: Pet[] = snapshot.docs
        .map((doc) => ({ pet_id: doc.id, ...doc.data() } as Pet))
        .filter((pet) => !evaluatedPetIds.has(pet.pet_id));

      setPets(newPets);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [evaluatedPetIds]);

  const saveUserPetInteraction = async (status: string, petId: string) => {
    try {
      await addDoc(collection(db, "user_pets_likes_dislikes"), {
        user_id: hardcodedUserId,
        pet_id: petId,
        status: status,
        createdAt: new Date(),
      });
      console.log(`${status} registrado en Firestore.`);
    } catch (error) {
      console.error("Error guardando la interacción:", error);
    }
  };

  const handleInteraction = async (status: string) => {
    if (pets.length === 0) return;

    const currentPetId = pets[0].pet_id;
    setEvaluatedPetIds(new Set(evaluatedPetIds).add(currentPetId));

    try {
      if (status === "like") await setShowLikeAnimation(true);
      if (status === "dislike") await setShowDislikeAnimation(true);
      saveUserPetInteraction(status, currentPetId);
    } catch (error) {
      console.error("Error en la interacción:", error);
    }
  };

  const handleSelectPet = (pet: Pet) => {
    setSelectedPet(pet); // Guardar el objeto pet en el estado global
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isLoading ? (
          <SkeletonItem
            width={Dimensions.get("window").width}
            height={Dimensions.get("window").height * 0.7}
            borderRadius={10}
          />
        ) : pets.length > 0 ? (
          <PetList
            pets={pets}
            onLoad={() => setIsLoading(false)}
            handleSelectPet={handleSelectPet}
          />
        ) : (
          <NotFindPets />
        )}

        <AnimatedEffect
          source={require("@/assets/animations/animation-like.json")}
          show={showLikeAnimation}
          onAnimationEnd={() => setShowLikeAnimation(false)}
        />
        <AnimatedEffect
          source={require("@/assets/animations/cross-animation.json")}
          show={showDislikeAnimation}
          onAnimationEnd={() => setShowDislikeAnimation(false)}
        />

        {!isLoading && pets.length > 0 && (
          <Buttons
            onLike={() => handleInteraction("like")}
            // onDislike={() => handleInteraction("dislike")}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
    backgroundColor: Colors.background.clearGray,
  },
  container: {
    alignItems: "center",
  },
});
