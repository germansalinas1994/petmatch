// app/pet-details/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import Colors from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";

type User = {
  id: string;
  nombre: string;
  imagen: string;
};

const PetDetails = () => {
  const [petsData, setPetsData] = useState<any[]>([]);
  // Caso para 1 mascota de prueba
  const pet = petsData[0];
  const [userData, setUserData] = useState<User | null>(null);
  const [readMore, setReadMore] = useState(true);

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
        console.error("Error fetching pets data:", error);
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
            // Agrega otras propiedades si las necesitas
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
    <View>
      <ScrollView>
        {/* Pet Info */}
        <Image
          source={require("../../assets/images/mascota1.jpeg")}
          style={{
            width: "100%",
            height: 400,
            resizeMode: "cover",
          }}
        />
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
              {pet?.nombre || "loading"}
            </Text>

            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 16,
                color: Colors.text.secondary,
                paddingTop: 5,
              }}
            >
              {pet?.direccion || "loading"}
            </Text>
          </View>
          <Entypo name="heart-outlined" size={30} color="black" />
        </View>

        {/* Pet Properties */}
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
                  {pet?.edad + " Años" || "loading"}
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
                  {pet?.tipo || "loading"}
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
                  {pet?.peso + " Kg" || "loading"}
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
                  {pet?.sexo || "loading"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* About */}
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
            Acerca de {pet?.nombre || "loading"}
          </Text>
          <Text
            numberOfLines={readMore ? 3 : 20}
            style={{
              fontFamily: "outfit",
              fontSize: 16,
              color: Colors.text.secondary,
              paddingTop: 10,
            }}
          >
            {pet?.descripcion || "loading"}
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
                {"Leer mas"}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Owner details */}
        <View
          style={{
            marginHorizontal: 20,
            paddingHorizontal: 20,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            borderWidth: 1,
            borderRadius: 15,
            padding: 10,
            borderBlockColor: Colors.background.primaryButton,
            backgroundColor: Colors.background.paper,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Image
              source={{ uri: userData?.imagen }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 99,
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
                {userData?.nombre}
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
          <Ionicons
            name="send-sharp"
            size={24}
            color={Colors.background.dark}
          />
        </View>
        <View
          style={{
            height: 70,
          }}
        ></View>
      </ScrollView>
      {/* adopt me button */}
      <View style={{
        position: "absolute",
        width: "100%",
        bottom: 0,
      }}>
          <TouchableOpacity style={{
            padding: 15,
            backgroundColor: Colors.primary.main,
          }}>
            <Text style={{
              textAlign: "center",
              fontFamily: "outfit-Bold",
              fontSize: 20,
            }}>Adoptame</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

export default PetDetails;
