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
import Buttons from "@/components/find/Buttons";
import AnimatedEffect from "@/components/find/AnimatedEffect";
import { db } from "../../config/FirebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { Pet } from "@/types";
import SkeletonItem from "@/components/SkeletonItem";
import PetList from "@/components/find/PetsList";
import NotFindPets from "@/components/find/NotFindPets";

export default function Find() {
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showDislikeAnimation, setShowDislikeAnimation] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]); // arreglo principal de mascotas
  const [displayedPets, setDisplayedPets] = useState<Pet[]>([]); // arreglo temporal para mostrar
  const [evaluatedPetIds, setEvaluatedPetIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const hardcodedUserId = "aBzu53nnGyivWW1KDq95";

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "user_pets_likes_dislikes"),
      (snapshot) => {
        const newEvaluatedIds = new Set(
          snapshot.docs
            .map((doc) => doc.data())
            .filter((data) => data.user_id === hardcodedUserId)
            .map((data) => data.pet_id)
        );
        setEvaluatedPetIds(newEvaluatedIds);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pets"), (snapshot) => {
      const newPets = snapshot.docs
        .map((doc) => ({ pet_id: doc.id, ...doc.data() } as Pet))
        .filter((pet) => !evaluatedPetIds.has(pet.pet_id));

      setPets(newPets);
      setDisplayedPets(newPets); // sincroniza displayedPets con pets al cargar
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [evaluatedPetIds]);

  const saveUserPetInteraction = async (status, petId) => {
    try {
      await addDoc(collection(db, "user_pets_likes_dislikes"), {
        user_id: hardcodedUserId,
        pet_id: petId,
        status,
        createdAt: new Date(),
      });
      console.log(`${status} registrado en Firestore.`);
    } catch (error) {
      console.error("Error guardando la interacción:", error);
    }
  };

  const handleInteraction = async (status) => {
    if (displayedPets.length === 0) return;

    const currentPetId = displayedPets[0].pet_id; // siempre toma el primer elemento

    try {
      if (status === "like") setShowLikeAnimation(true);
      if (status === "dislike") setShowDislikeAnimation(true);

      await saveUserPetInteraction(status, currentPetId);
    } catch (error) {
      console.error("Error en la interacción:", error);
    }
  };

  const removeCurrentPet = () => {
    setDisplayedPets((prevDisplayedPets) => prevDisplayedPets.slice(1)); // elimina el primer elemento de la copia temporal
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
        ) : displayedPets.length > 0 ? (
          <PetList pets={displayedPets} onLoad={() => setIsLoading(false)} />
        ) : (
          <NotFindPets />
        )}

        <AnimatedEffect
          source={require("@/assets/animations/animation-like.json")}
          show={showLikeAnimation}
          onAnimationEnd={() => {
            setShowLikeAnimation(false);
            removeCurrentPet();
          }}
        />
        <AnimatedEffect
          source={require("@/assets/animations/cross-animation.json")}
          show={showDislikeAnimation}
          onAnimationEnd={() => {
            setShowDislikeAnimation(false);
            removeCurrentPet();
          }}
        />

        {!isLoading && displayedPets.length > 0 && (
          <Buttons
            onLike={() => handleInteraction("like")}
            onDislike={() => handleInteraction("dislike")}
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
