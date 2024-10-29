import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePetStore } from "@/stores/petStore";
import SkeletonItem from "@/components/SkeletonItem";
import PetImages from "@/components/pet-details/PetImages";
import PetInfo from "@/components/pet-details/PetInfo";
import PetAbout from "@/components/pet-details/PetAbout";
import UserInfo from "@/components/pet-details/UserInfo";
import { User } from "@/types";

export default function Find() {
  const [userData, setUserData] = useState<User | null>(null);
  const [readMore, setReadMore] = useState(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { petId } = useLocalSearchParams();
  const petData = usePetStore((state) => state.selectedPet);

  useEffect(() => {
    if (petData?.user_id) {
      fetchUserData(petData.user_id);
    }
  }, [petData]);

  const fetchUserData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as User);
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <ScrollView>
          {petData ? (
            <PetImages
              images={petData.images || []}
              onBackPress={() => router.back()}
              topInset={insets.top}
            />
          ) : (
            <SkeletonItem width={300} height={200} borderRadius={10} style={{ marginTop: insets.top, alignSelf: "center" }} />
          )}

          {petData ? (
            <PetInfo petData={petData} />
          ) : (
            <SkeletonItem width={300} height={60} borderRadius={10} style={{ alignSelf: "center", marginVertical: 10 }} />
          )}

          {petData ? (
            <PetAbout
              name={petData.nombre}
              description={petData.descripcion}
              readMore={readMore}
              onToggleReadMore={() => setReadMore(!readMore)}
            />
          ) : (
            <SkeletonItem width={300} height={120} borderRadius={10} style={{ alignSelf: "center", marginVertical: 10 }} />
          )}

          {userData ? (
            <UserInfo
              userName={userData.nombre || "Cargando..."}
              userImage={userData.imagen}
            />
          ) : (
            <SkeletonItem width={300} height={60} borderRadius={10} style={{ alignSelf: "center", marginVertical: 10 }} />
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1 },
  bottomSpacing: { height: 70 },
});
