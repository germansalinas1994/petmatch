import {
  View,
  Dimensions,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
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
  const hardcodedUserId = "aBzu53nnGyivWW1KDq95";

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "user_pets_likes_dislikes"),
      (snapshot) => {
        const newEvaluatedIds = new Set<string>(
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


    if (status === "like") await setShowLikeAnimation(true);
    if (status === "dislike") await setShowDislikeAnimation(true);

    try {
      await saveUserPetInteraction(status, currentPetId);
    } catch (error) {
      console.error("Error en la interacción:", error);
    }
  };


  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {isLoading ? (
          <SkeletonItem
            width={Dimensions.get("window").width}
            height={Dimensions.get("window").height * 0.7}
            borderRadius={10}
          />
        ) : pets.length > 0 ? (
          <FlatList
            data={pets}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Link href="/pet-details" asChild>
                <Pressable style={styles.imageContainer}>
                  {item.images && typeof item.images[0] === "string" ? (
                    <Image
                      uri={item.images[0]}
                      style={styles.image}
                      preview={{ uri: placeholderImage }}
                    />
                  ) : (
                    <Image
                      uri={placeholderImage}
                      style={styles.image}
                      preview={{ uri: placeholderImage }}
                    />
                  )}
                </Pressable>
              </Link>
            )}
            keyExtractor={(item) => item.pet_id}
          />
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
    backgroundColor: Colors.background.clearGray,
  },
  container: {
    alignItems: "center",
  },
  imageContainer: {
    width: Dimensions.get("window").width,
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
