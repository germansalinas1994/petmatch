// app/pet-details/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../../config/FirebaseConfig";
import Colors from '@/constants/Colors';
import Entypo from '@expo/vector-icons/Entypo';

const PetDetails = () => {
  const [petsData, setPetsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchPetsData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pets'));
        const petsArray: any[] = [];
        querySnapshot.forEach((doc) => {
          petsArray.push({ id: doc.id, ...doc.data() });
        });
        setPetsData(petsArray);
      } catch (error) {
        console.error('Error fetching pets data:', error);
      }
    };

    fetchPetsData();
  }, []);

  // Caso para 1 mascota de prueba
  const pet = petsData[0];
  const [readMore, setReadMore] = useState(true);

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
        <View style={{
          padding: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <View>
            <Text style={{
              fontFamily: "outfit-Bold",
              fontSize: 27,
              color: Colors.text.primary,
            }}
            >{pet?.nombre || 'loading'}</Text>

            <Text style={{
              fontFamily: "outfit",
              fontSize: 16,
              color: Colors.text.secondary,
              paddingTop: 5,
            }}>{pet?.direccion || 'loading'}</Text>
          </View>
          <Entypo name="heart-outlined" size={30} color="black" />
        </View>

        {/* Pet Properties */}
        <View style={{
          paddingHorizontal: 20,
        }}>
          {/* Primera fila */}
          <View style={{
            flexDirection: 'row',
          }}>
            {/* Edad */}
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.background.secondaryButton,
              padding: 10,
              margin: 5,
              borderRadius: 10,
            }}>
              <Image source={require("../../assets/images/calendar.png")}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 10,
                }}
              />
              <View>
                <Text style={{
                  fontFamily: "outfit",
                  fontSize: 16,
                  color: Colors.text.primary,
                }}>Edad</Text>
                <Text style={{
                  fontFamily: "outfit-Bold",
                  fontSize: 18,
                  color: Colors.text.secondary,
                }}>{pet?.edad + " Años" || 'loading'}</Text>
              </View>
            </View>
            {/* Tipo */}
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.background.secondaryButton,
              padding: 10,
              margin: 5,
              borderRadius: 10,
            }}>
              <Image source={require("../../assets/images/bone.png")}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 10,
                }}
              />
              <View>
                <Text style={{
                  fontFamily: "outfit",
                  fontSize: 16,
                  color: Colors.text.primary,
                }}>Tipo</Text>
                <Text style={{
                  fontFamily: "outfit-Bold",
                  fontSize: 18,
                  color: Colors.text.secondary,
                }}>{pet?.tipo || 'loading'}</Text>
              </View>
            </View>
          </View>

          {/* Segunda fila */}
          <View style={{
            flexDirection: 'row',
          }}>
            {/* Peso */}
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.background.secondaryButton,
              padding: 10,
              margin: 5,
              borderRadius: 10,
            }}>
              <Image source={require("../../assets/images/weight.png")}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 10,
                }}
              />
              <View>
                <Text style={{
                  fontFamily: "outfit",
                  fontSize: 16,
                  color: Colors.text.primary,
                }}>Peso</Text>
                <Text style={{
                  fontFamily: "outfit-Bold",
                  fontSize: 18,
                  color: Colors.text.secondary,
                }}>{pet?.peso + " Kg" || 'loading'}</Text>
              </View>
            </View>
            {/* Sexo */}
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.background.secondaryButton,
              padding: 10,
              margin: 5,
              borderRadius: 10,
            }}>
              <Image source={require("../../assets/images/sex.png")}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 10,
                }}
              />
              <View>
                <Text style={{
                  fontFamily: "outfit",
                  fontSize: 16,
                  color: Colors.text.primary,
                }}>Sexo</Text>
                <Text style={{
                  fontFamily: "outfit-Bold",
                  fontSize: 18,
                  color: Colors.text.secondary,
                }}>{pet?.sexo || 'loading'}</Text>
              </View>
            </View>
          </View>

        </View>
        
        {/* About */}
        <View style={{
          padding: 20,
        }}>
          <Text style={{
            fontFamily: "outfit-Bold",
            fontSize: 20,
            color: Colors.text.primary,
          }}>Acerca de {pet?.nombre || 'loading'}</Text>
          <Text numberOfLines={readMore?3:20} style={{
            fontFamily: "outfit",
            fontSize: 16,
            color: Colors.text.secondary,
            paddingTop: 10,
          }}>{pet?.descripcion || 'loading'}</Text>
          {readMore&&
          <Pressable onPress={()=>setReadMore(false)}>
          <Text style={{
            fontFamily: "outfit",
            fontSize: 14,
            color: Colors.text.disabled,
          }}>{'Leer mas'}</Text>
        
          </Pressable>}

          


        </View>

         {/* Owner details */}
         
      </ScrollView>
      </View>

  );
};

export default PetDetails;
