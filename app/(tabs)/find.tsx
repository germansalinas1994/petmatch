import {
  View,
  Dimensions,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Buttons from "@/components/find/Buttons";
import AnimatedEffect from "@/components/find/AnimatedEffect";
import { db } from "../../config/FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  limit,
} from "firebase/firestore";
import { Pet } from "@/types";
import { Image } from "react-native-expo-image-cache";
import SkeletonItem from "@/components/SkeletonItem";

const placeholderImage = require("../../assets/images/dog-placeholder.png");

export default function Find() {
  const insets = useSafeAreaInsets();
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showDislikeAnimation, setShowDislikeAnimation] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false); // Nuevo estado para controlar la animación

  const hardcodedEmail = "germansalinas.fce@gmail.com";

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserId();
      await fetchUnlikedPets();
    };
    initializeData();
  }, [userId]);

  const fetchUserId = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("mail", "==", hardcodedEmail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserId(userDoc.id);
      } else {
        console.log("Usuario no encontrado.");
      }
    } catch (error) {
      console.error("Error recuperando el usuario:", error);
    }
  };

  const fetchUnlikedPets = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      const interactionsRef = collection(db, "user_pets_likes_dislikes");
      const interactionsQuery = query(
        interactionsRef,
        where("user_id", "==", userId)
      );
      const interactionsSnapshot = await getDocs(interactionsQuery);

      const evaluatedPetIds = interactionsSnapshot.docs.map(
        (doc) => doc.data().pet_id
      );

      const petsRef = collection(db, "pets");
      const petsQuery = query(petsRef, limit(20));
      const petsSnapshot = await getDocs(petsQuery);

      const unlikedPets = petsSnapshot.docs
        .map((doc) => ({
          pet_id: doc.id,
          ...doc.data(),
        }))
        .filter((pet) => !evaluatedPetIds.includes(pet.pet_id)) as Pet[];

      setPets(unlikedPets);
      setIsLoading(false);
    } catch (error) {
      console.error("Error obteniendo mascotas no evaluadas:", error);
      setIsLoading(false);
    }
  };

  const saveUserPetInteraction = async (status: string, petId: string) => {
    if (!userId) {
      console.log("User ID no disponible.");
      return;
    }

    try {
      await addDoc(collection(db, "user_pets_likes_dislikes"), {
        user_id: userId,
        pet_id: petId,
        status: status,
        createdAt: new Date(),
      });
      console.log(`${status} registrado en Firestore.`);
    } catch (error) {
      console.error("Error guardando la interacción:", error);
    }
  };

  const handleInteraction = (status: string) => {
    if (pets.length === 0 || isAnimating) return;

    const currentPetId = pets[0].pet_id;
    setIsAnimating(true); // Bloquea el avance hasta que la animación termine

    if (status === "like") setShowLikeAnimation(true);
    if (status === "dislike") setShowDislikeAnimation(true);

    saveUserPetInteraction(status, currentPetId);
  };

  const handleAnimationEnd = () => {
    // Avanza a la siguiente mascota solo cuando la animación termina
    setPets((prevPets) => {
      const newPets = prevPets.slice(1);
      if (newPets.length < 5) {
        fetchUnlikedPets(); // Carga más mascotas si quedan menos de 5
      }
      return newPets;
    });
    setIsAnimating(false); // Desbloquea el avance
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <Link href="/pet-details" asChild>
          <Pressable style={styles.imageContainer}>
            {isLoading ? (
              <SkeletonItem
                width={Dimensions.get("window").width}
                height={Dimensions.get("window").height * 0.7}
                color="#bfbfbf"
                borderRadius={10}
              />
            ) : pets.length > 0 &&
              pets[0].images &&
              pets[0].images.length > 0 ? (
              <Image
                uri={pets[0].images[0]}
                style={styles.image}
                preview={{ uri: placeholderImage }}
              />
            ) : (
              <Text style={styles.noPetsText}>
                No se encontraron nuevas mascotas disponibles.
              </Text>
            )}
          </Pressable>
        </Link>

        <AnimatedEffect
          source={require("@/assets/animations/animation-like.json")}
          show={showLikeAnimation}
          onAnimationEnd={() => {
            setShowLikeAnimation(false);
            handleAnimationEnd(); // Avanza después de la animación
          }}
        />
        <AnimatedEffect
          source={require("@/assets/animations/cross-animation.json")}
          show={showDislikeAnimation}
          onAnimationEnd={() => {
            setShowDislikeAnimation(false);
            handleAnimationEnd(); // Avanza después de la animación
          }}
        />

        {!isLoading && pets.length > 0 && (
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
    backgroundColor: Colors.background.paper,
  },
  container: {
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: Dimensions.get("window").height * 0.7,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  noPetsText: {
    fontSize: 18,
    color: Colors.text.primary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
