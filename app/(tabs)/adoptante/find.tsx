import {
  View,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "@/constants/Colors";
import Buttons from "@/components/find/Buttons";
import AnimatedEffect from "@/components/find/AnimatedEffect";
import { db } from "@/config/FirebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Pet } from "@/types";
import SkeletonItem from "@/components/SkeletonItem";
import PetList from "@/components/find/PetsList";
import NotFindPets from "@/components/find/NotFindPets";
import { usePetStore } from "@/stores/petStore";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { RoleCodes } from "@/constants/roles";
import useUserStore from "@/stores/userStore";
import Header from "@/components/Header";

export default function Find() {
  useProtectedRoute(RoleCodes.Adoptante);

  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showDislikeAnimation, setShowDislikeAnimation] = useState(false);
  const [currentPetIndex, setCurrentPetIndex] = useState(0); // Estado para el índice actual
  const { idUser } = useUserStore(); 
  const [pets, setPets] = useState<Pet[]>([]);
  const [evaluatedPetIds, setEvaluatedPetIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const setSelectedPet = usePetStore((state) => state.setSelectedPet);

  useEffect(() => {
    const userQuery = query(
      collection(db, "user_pets_likes_dislikes"),
      where("user_id", "==", idUser)
    );

    const unsubscribe = onSnapshot(userQuery, (snapshot) => {
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
        user_id: idUser,
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

    const currentPetId = pets[currentPetIndex].pet_id; // Usar el índice actual
    setEvaluatedPetIds(new Set(evaluatedPetIds).add(currentPetId));

    try {
      if (status === "like") await setShowLikeAnimation(true);
      await saveUserPetInteraction(status, currentPetId);

      setPets((prevPets) => prevPets.filter((pet) => pet.pet_id !== currentPetId));
      setCurrentPetIndex((prevIndex) => Math.max(0, prevIndex - 1)); // Ajustar el índice
    } catch (error) {
      console.error("Error en la interacción:", error);
    }
  };

  const handleSelectPet = (pet: Pet) => {
    setSelectedPet(pet);
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
            setCurrentPetIndex={setCurrentPetIndex} // Pasar setCurrentPetIndex
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
