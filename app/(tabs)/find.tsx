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
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { Pet } from "@/types";
import { Image } from "react-native-expo-image-cache";
import SkeletonItem from "@/components/SkeletonItem";
import { Platform } from "react-native"; // Importamos Platform para detección de sistema operativo

const placeholderImage = require("../../assets/images/dog-placeholder.png");

export default function Find() {
  const insets = useSafeAreaInsets();
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showDislikeAnimation, setShowDislikeAnimation] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [evaluatedPetIds, setEvaluatedPetIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const hardcodedUserId = "aBzu53nnGyivWW1KDq95"; // Id de mi usuario

  // Escucha en tiempo real para mascotas evaluadas
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "user_pets_likes_dislikes"),
      (snapshot) => {
        const newEvaluatedIds = new Set<string>();
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.user_id === hardcodedUserId) {
            newEvaluatedIds.add(data.pet_id);
          }
        });
        setEvaluatedPetIds(newEvaluatedIds);
      }
    );

    return () => unsubscribe();
  }, []);

  // Escucha en tiempo real para obtener las mascotas, excluyendo las evaluadas
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pets"), (snapshot) => {
      const newPets: Pet[] = [];
      snapshot.forEach((doc) => {
        const pet = { pet_id: doc.id, ...doc.data() } as Pet;
        if (!evaluatedPetIds.has(pet.pet_id)) {
          // Excluye mascotas evaluadas
          newPets.push(pet);
        }
      });
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
    setPets((prevPets) => prevPets.slice(1));
    setIsAnimating(false); // Desbloquea el avance
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {isLoading ? (
          <SkeletonItem
            width={Dimensions.get("window").width}
            height={Dimensions.get("window").height * 0.7}
            color="#bfbfbf"
            borderRadius={10}
          />
        ) : pets.length > 0 && pets[0].images && pets[0].images[0] ? (
          // Solo renderizar `Image` si `uri` es una cadena válida
          <Link href="/pet-details" asChild>
            <Pressable style={styles.imageContainer}>
              {typeof pets[0].images[0] === "string" ? (
                <Image
                  uri={pets[0].images[0]}
                  style={styles.image}
                  preview={{ uri: placeholderImage }}
                />
              ) : (
                // Si `uri` no es válido, mostramos `placeholderImage`
                <Image
                  uri={placeholderImage}
                  style={styles.image}
                  preview={{ uri: placeholderImage }}
                />
              )}
            </Pressable>
          </Link>
        ) : (
          <View style={styles.imageContainer}>
            <Text style={styles.noPetsText}>
              No se encontraron nuevas mascotas disponibles.
            </Text>
          </View>
        )}

        <AnimatedEffect
          source={require("@/assets/animations/animation-like.json")}
          show={showLikeAnimation}
          onAnimationEnd={() => {
            setShowLikeAnimation(false);
            handleAnimationEnd();
          }}
        />
        <AnimatedEffect
          source={require("@/assets/animations/cross-animation.json")}
          show={showDislikeAnimation}
          onAnimationEnd={() => {
            setShowDislikeAnimation(false);
            handleAnimationEnd();
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
