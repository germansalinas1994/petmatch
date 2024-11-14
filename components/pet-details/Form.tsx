import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { RadioButton, TextInput, HelperText } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface PetFormData {
    id: string;
    nombre: string;
    descripcion: string;
    direccion: string;
    edad: number;
    tipo: string;
    peso: number;
    sexo: string;
    images: string[];
}

interface FormProps {
    onSubmit: (data: PetFormData, reset: () => void) => void;
    defaultValues?: PetFormData;
}

export default function Form({
    onSubmit,
    defaultValues,
}: FormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PetFormData>({
        defaultValues: defaultValues || {
            nombre: "",
            descripcion: "",
            direccion: "",
            edad: 0,
            tipo: "",
            peso: 0,
            sexo: "",
        },
    });

    return (
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Cargar una Mascota</Text>

                {/* Nombre y Tipo */}
                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Nombre *</Text>
                        <Controller
                            control={control}
                            name="nombre"
                            rules={{ required: "El nombre es obligatorio" }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    value={value}
                                    mode="outlined"
                                    error={!!errors.nombre}
                                />
                            )}
                        />
                        {errors.nombre?.message && (
                            <HelperText type="error">{errors.nombre.message}</HelperText>
                        )}
                    </View>

                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Tipo *</Text>
                        <Controller
                            control={control}
                            name="tipo"
                            rules={{ required: "El tipo es obligatorio" }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    value={value}
                                    mode="outlined"
                                    error={!!errors.tipo}
                                />
                            )}
                        />
                        {errors.tipo?.message && (
                            <HelperText type="error">{errors.tipo.message}</HelperText>
                        )}
                    </View>
                </View>

                {/* Descripción */}
                <Text style={styles.label}>Descripción *</Text>
                <Controller
                    control={control}
                    name="descripcion"
                    rules={{ required: "La descripción es obligatoria" }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            onChangeText={onChange}
                            value={value}
                            mode="outlined"
                            error={!!errors.descripcion}
                            multiline
                        />
                    )}
                />
                {errors.descripcion?.message && (
                    <HelperText type="error">{errors.descripcion.message}</HelperText>
                )}

                {/* Dirección y Sexo */}
                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Dirección *</Text>
                        <Controller
                            control={control}
                            name="direccion"
                            rules={{ required: "La dirección es obligatoria" }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    value={value}
                                    mode="outlined"
                                    error={!!errors.direccion}
                                />
                            )}
                        />
                        {errors.direccion?.message && (
                            <HelperText type="error">{errors.direccion.message}</HelperText>
                        )}
                    </View>

                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Sexo *</Text>
                        <Controller
                            control={control}
                            name="sexo"
                            rules={{ required: "El sexo es obligatorio" }}
                            render={({ field: { onChange, value } }) => (
                                <RadioButton.Group onValueChange={onChange} value={value}>
                                    <View style={styles.radioContainer}>
                                        <RadioButton.Item label="Macho" value="Macho" />
                                        <RadioButton.Item label="Hembra" value="Hembra" />
                                    </View>
                                </RadioButton.Group>
                            )}
                        />
                        {errors.sexo?.message && (
                            <HelperText type="error">{errors.sexo.message}</HelperText>
                        )}
                    </View>
                </View>

                {/* Edad y Peso */}
                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Edad</Text>
                        <Controller
                            control={control}
                            name="edad"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => onChange(parseInt(text, 10))}
                                    value={value.toString()}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    error={!!errors.edad}
                                />
                            )}
                        />
                    </View>

                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Peso</Text>
                        <Controller
                            control={control}
                            name="peso"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => onChange(parseInt(text, 10))}
                                    value={value.toString()}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    error={!!errors.peso}
                                />
                            )}
                        />
                    </View>
                </View>

                {/* Imágenes */}
                <Text style={styles.label}>Imágenes</Text>
                <Controller
                    control={control}
                    name="images"
                    defaultValue={[]}
                    render={({ field: { onChange, value } }) => (
                        <View>
                            <View style={styles.imagePreviewContainer}>
                                {value && value.map((imageUri, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri: imageUri }}
                                        style={styles.imagePreview}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity
                                style={styles.imagePickerButton}
                                onPress={async () => {
                                    const result = await ImagePicker.launchImageLibraryAsync({
                                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                        allowsEditing: true,
                                        aspect: [4, 3],
                                        quality: 1,
                                    });

                                    if (!result.canceled) {
                                        const selectedImageUri = result.assets[0].uri;
                                        onChange([...(value || []), selectedImageUri]);
                                    }
                                }}
                            >
                                <Text style={styles.buttonText}>Seleccionar Imagen</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />

                {/* Botón de envío */}
                <TouchableOpacity
                    onPress={handleSubmit((data) => onSubmit(data, reset))}
                    style={styles.submitButton}
                >
                    <Text style={styles.buttonText}>
                        {defaultValues ? "Actualizar Mascota" : "Guardar Mascota"}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        padding: 10,
        marginTop: "8%",
    },
    title: {
        fontSize: 24,
        fontFamily: "outfit-bold",
        textAlign: "center",
        marginBottom: 50,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    halfInputContainer: {
        width: "48%",
    },
    label: {
        fontSize: 16,
        marginVertical: 5,
        fontFamily: "outfit",
    },
    input: {
        backgroundColor: Colors.background.paper,
        fontFamily: "outfit",

    },
    descriptionInput: {
        height: 100,
    },
    radioContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderWidth: 1,
        borderColor: Colors.background.gray,
        backgroundColor: Colors.background.paper,
        borderRadius: 5,
        fontFamily: "outfit",
        padding: 1,
    },

    submitButton: {
        padding: 8,
        width: "30%",
        alignSelf: "center",
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: Colors.background.primaryButton,
    },
    buttonText: {
        textAlign: "center",
        padding: 10,
        color: Colors.text.white,
        fontSize: 16,
        fontFamily: "outfit-medium",
    },
    imagePickerButton: {
        backgroundColor: Colors.background.default,
        padding: 0,
        width: "50%",
        borderRadius: 10,
        marginVertical: 5,
        alignSelf: "center",
    },
    imagePreviewContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    imagePreview: {
        width: 80,
        height: 80,
        borderRadius: 10,
        margin: 5,
    },
});
