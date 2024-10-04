// app/pet-details/index.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import Colors from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import Icon from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';

type User = {
  id: string;
  nombre: string;
  imagen: string;
};

const PetDetails = () => {
  const [petsData, setPetsData] = useState<any[]>([]);
  const pet = petsData[0]; // Caso para 1 mascota de prueba
  const [userData, setUserData] = useState<User | null>(null);
  const [readMore, setReadMore] = useState(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchPetsData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pets"));
        const petsArray: any[] = [];
        querySnapshot.forEach((doc) => {
          petsArray.push({ id: doc.id, ...doc.data() });
        });
        setPetsData(petsArray);
      } catch (error) {
        console.error("Error al obtener los datos de las mascotas:", error);
      }
    };

    fetchPetsData();
  }, []);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersArray: User[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          usersArray.push({
            id: doc.id,
            nombre: data.nombre ?? "Unknown",
            imagen: data.imagen ?? "",
          });
        });
        // Usamos el primer usuario por ahora
        if (usersArray.length > 0) {
          setUserData(usersArray[0]);
        }
      } catch (error) {
        console.error("Error al obtener los datos de los usuarios:", error);
      }
    };

    fetchUsersData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView>
          {/* Informacion de mascota */}
          <View style={{ position: 'relative' }}>
            <Image
              source={require("../../assets/images/mascota1.jpeg")}
              style={{
                width: "100%",
                height: 400,
                resizeMode: "cover",
              }}
            />
            <Pressable
              onPress={() => router.back()}
              style={{
                position: 'absolute',
                top: insets.top - 10,
                left: 10,
                width: 60,
                height: 60,
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              
              }}
            >
              <AntDesign name="arrowleft" size={35} color={Colors.text.white} />
            </Pressable>
          </View>

          {/* Detalles de la mascota */}
          <View
            style={{
              padding: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "outfit-Bold",
                  fontSize: 27,
                  color: Colors.text.primary,
                }}
              >
                {pet?.nombre || "Cargando..."}
              </Text>
              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 16,
                  color: Colors.text.secondary,
                  paddingTop: 5,
                }}
              >
                {pet?.direccion || "Cargando..."}
              </Text>
            </View>
            <Entypo name="heart-outlined" size={30} color="black" />
          </View>

          {/* Propiedades de la mascota */}
          <View
            style={{
              paddingHorizontal: 20,
            }}
          >
            {/* Primera fila */}
            <View
              style={{
                flexDirection: "row",
              }}
            >
              {/* Edad */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.background.secondaryButton,
                  padding: 10,
                  margin: 5,
                  borderRadius: 10,
                }}
              >
                <Image
                  source={require("../../assets/images/calendar.png")}
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 10,
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontFamily: "outfit",
                      fontSize: 16,
                      color: Colors.text.primary,
                    }}
                  >
                    Edad
                  </Text>
                  <Text
                    style={{
                      fontFamily: "outfit-Bold",
                      fontSize: 18,
                      color: Colors.text.secondary,
                    }}
                  >
                    {pet?.edad + " Años" || "Cargando..."}
                  </Text>
                </View>
              </View>

              {/* Tipo */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.background.secondaryButton,
                  padding: 10,
                  margin: 5,
                  borderRadius: 10,
                }}
              >
                <Image
                  source={require("../../assets/images/bone.png")}
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 10,
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontFamily: "outfit",
                      fontSize: 16,
                      color: Colors.text.primary,
                    }}
                  >
                    Tipo
                  </Text>
                  <Text
                    style={{
                      fontFamily: "outfit-Bold",
                      fontSize: 18,
                      color: Colors.text.secondary,
                    }}
                  >
                    {pet?.tipo || "Cargando..."}
                  </Text>
                </View>
              </View>
            </View>

            {/* Segunda fila */}
            <View
              style={{
                flexDirection: "row",
              }}
            >
              {/* Peso */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.background.secondaryButton,
                  padding: 10,
                  margin: 5,
                  borderRadius: 10,
                }}
              >
                <Image
                  source={require("../../assets/images/weight.png")}
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 10,
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontFamily: "outfit",
                      fontSize: 16,
                      color: Colors.text.primary,
                    }}
                  >
                    Peso
                  </Text>
                  <Text
                    style={{
                      fontFamily: "outfit-Bold",
                      fontSize: 18,
                      color: Colors.text.secondary,
                    }}
                  >
                    {pet?.peso + " Kg" || "Cargando..."}
                  </Text>
                </View>
              </View>

              {/* Sexo */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.background.secondaryButton,
                  padding: 10,
                  margin: 5,
                  borderRadius: 10,
                }}
              >
                <Image
                  source={require("../../assets/images/sex.png")}
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 10,
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontFamily: "outfit",
                      fontSize: 16,
                      color: Colors.text.primary,
                    }}
                  >
                    Sexo
                  </Text>
                  <Text
                    style={{
                      fontFamily: "outfit-Bold",
                      fontSize: 18,
                      color: Colors.text.secondary,
                    }}
                  >
                    {pet?.sexo || "Cargando..."}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Acerca de la mascota */}
          <View
            style={{
              padding: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit-Bold",
                fontSize: 20,
                color: Colors.text.primary,
              }}
            >
              Acerca de {pet?.nombre || "Cargando..."}
            </Text>
            <Text
              numberOfLines={readMore ? 3 : undefined}
              style={{
                fontFamily: "outfit",
                fontSize: 16,
                color: Colors.text.secondary,
                paddingTop: 10,
              }}
            >
              {pet?.descripcion || "Cargando..."}
            </Text>
            {readMore && (
              <Pressable onPress={() => setReadMore(false)}>
                <Text
                  style={{
                    fontFamily: "outfit",
                    fontSize: 14,
                    color: Colors.text.disabled,
                  }}
                >
                  Leer más
                </Text>
              </Pressable>
            )}
          </View>

          {/* Detalles del dueño */}
          <View
            style={{
              marginHorizontal: 20,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 15,
              padding: 10,
              borderColor: Colors.background.primaryButton,
              backgroundColor: Colors.background.paper,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={
                  userData?.imagen
                    ? { uri: userData.imagen }
                    : require("../../assets/images/adaptive-icon.png")
                }
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 99,
                  marginRight: 10,
                }}
              />
              <View>
                <Text
                  style={{
                    fontFamily: "outfit-Bold",
                    fontSize: 17,
                    color: Colors.text.primary,
                  }}
                >
                  {userData?.nombre || "Cargando..."}
                </Text>
                <Text
                  style={{
                    fontFamily: "outfit",
                    fontSize: 14,
                    color: Colors.text.secondary,
                  }}
                >
                  Dueño
                </Text>
              </View>
            </View>
            <Icon
              name="send"
              size={24}
              color={Colors.background.dark}
            />
          </View>

          {/* Espacio adicional */}
          <View
            style={{
              height: 70,
            }}
          />
        </ScrollView>

        {/* Botón "Adoptame" */}
        {/* <View
          style={{
            position: "absolute",
            width: "100%",
            bottom: 0,
          }}
        >
          <TouchableOpacity
            style={{
              padding: 15,
              backgroundColor: Colors.primary.main,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "outfit-Bold",
                fontSize: 20,
              }}
            >
              Adoptame
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default PetDetails;
