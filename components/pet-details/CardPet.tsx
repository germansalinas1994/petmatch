import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Button } from "react-native";
import Colors from "@/constants/Colors";


interface CardPetProps {
    name: string;
    address: string;
    type: string;
    image?: string;
    onEdit: () => void;
    onDelete: () => void;
}

const CardPet: React.FC<CardPetProps> = ({ name, address, type, image, onEdit, onDelete }) => {
    return (

            <View style={styles.cardContainer}>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Nombre:</Text>
                        <Text style={styles.value}>{name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Dirección:</Text>
                        <Text style={styles.value}>{address}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Tipo:</Text>
                        <Text style={styles.value}>{type}</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Editar" onPress={onEdit} color={Colors.background.primaryButton} />
                    <Button title="Eliminar" onPress={onDelete} color={Colors.background.secondaryButton} />
                </View>
            </View>

    );
};

export default CardPet;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        margin: 16,
        alignSelf: "center",
        width: "90%",
        maxWidth: 350,
    },
    image: {
        width: "100%",
        height: 350,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    infoContainer: {
        padding: 50,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    label: {
        fontWeight: "bold",
        color: "#333",
        width: 80,
    },
    value: {
        color: "#555",
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingBottom: 36,
        paddingHorizontal: 50,
    },
    
});
