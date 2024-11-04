import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import Header from "@/components/Header";
import { db } from "@/config/FirebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import SkeletonItem from "@/components/SkeletonItem";
import Colors from "@/constants/Colors";
import UserModal from "@/components/UserModal";
import { User } from "@/types/index";
import useUserStore from "@/stores/userStore";
import { useProtectedRoute } from "@/hooks/useProtectedRoute"; // Importa el hook
import { RoleCodes } from "@/constants/roles"; // Importa los códigos de roles

export default function Likes() {
  useProtectedRoute(RoleCodes.Rescatista);
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [petId, setPetId] = useState<string | null>(null);
  const { idUser} = useUserStore();
  const [isImageLoaded, setIsImageLoaded] = useState(false);


  useEffect(() => {
    if (!idUser) {
      setPetId(null);
      setUsers([]);
      setLoading(false);
      return;
    }

    // Obtener el `petId` solo si `idUser` no es null
    const getPetId = async () => {
      try {
        console.log("idUser:", idUser); // Verificar el idUser en la consola

        const petsCollection = collection(db, "pets");
        const petsQuery = query(petsCollection, where("user_id", "==", idUser));
        const petsSnapshot = await getDocs(petsQuery);

        if (!petsSnapshot.empty) {
          const petDoc = petsSnapshot.docs[0]; // Obtiene el primer documento
          console.log("Pet document data:", petDoc.data());
          console.log("Pet document ID:", petDoc.id);
          setPetId(petDoc.id); // Establece el `petId`
        } else {
          console.error("No se encontró la mascota para el usuario.");
          setLoading(false); // Detener la carga si no se encuentra el `petId`
        }
      } catch (error) {
        console.error("Error al obtener el petId:", error);
        setLoading(false); // Detener la carga si ocurre un error
      }
    };

    getPetId();
  }, [idUser]);

  useEffect(() => {
    if (!petId) return; // Espera a que `petId` esté disponible

    // Suscripción en tiempo real a `user_pets_likes_dislikes` cuando `petId` está disponible
    const likesCollection = collection(db, "user_pets_likes_dislikes");
    const likesQuery = query(
      likesCollection,
      where("pet_id", "==", petId),
      where("status", "==", "like")
    );

    const unsubscribeLikes = onSnapshot(likesQuery, (likesSnapshot) => {
      const likedUserIds = likesSnapshot.docs.map((doc) => doc.data().user_id);
      console.log("Liked User IDs:", likedUserIds);

      if (likedUserIds.length > 0) {
        const usersCollection = collection(db, "users");
        const userQuery = query(
          usersCollection,
          where("__name__", "in", likedUserIds)
        );

        const unsubscribeUsers = onSnapshot(userQuery, (userSnapshot) => {
          const usersList = userSnapshot.docs.map((doc) => ({
            user_id: doc.id,
            ...doc.data(),
          })) as User[];

          setUsers(usersList);
          setLoading(false); // Detener la carga cuando los datos estén listos
        });

        // Limpiar suscripción de `users` al desmontar
        return () => unsubscribeUsers();
      } else {
        setUsers([]); // Si no hay likes, vacía la lista
        setLoading(false); // Detener la carga si no hay usuarios que dieron like
      }
    });
    // Limpiar suscripción de `likes` al desmontar
    return () => unsubscribeLikes();
  }, [petId]);

  const renderSkeleton = () => (
    <View style={styles.userCard}>
      <SkeletonItem
        width={50}
        height={50}
        borderRadius={25}
        style={styles.skeletonImage}
      />
      <SkeletonItem
        width={100}
        height={20}
        borderRadius={5}
        style={styles.skeletonText}
      />
    </View>
  );

  const openModal = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    console.log("item", item),
    <View style={styles.userCard}>
      <TouchableOpacity onPress={() => openModal(item)}>
      <Image
        source={
          item.imagen
            ? { uri: item.imagen }
            : require('@/assets/images/default_user.jpg')
        }
        style={styles.profileImage}
        onLoad={() => setIsImageLoaded(true)} 
      />
      </TouchableOpacity>
      <Text style={styles.userName}>{item.nombre}</Text>
    </View>
  );

  return (
    <View>
      <Header title="Interesados" />
      {loading ? (
        <FlatList
          data={Array(10).fill({})}
          renderItem={renderSkeleton}
          keyExtractor={(_, index) => index.toString()}
        />
      ) : (
        <View style={styles.container}>
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.user_id}
          />
          <UserModal
            visible={modalVisible}
            onClose={closeModal}
            user={selectedUser || null}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  userCard: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  skeletonImage: {
    marginRight: 10,
  },
  skeletonText: {
    marginLeft: 10,
  },
});
