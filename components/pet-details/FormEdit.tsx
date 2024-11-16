import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { RadioButton, TextInput, HelperText } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Pet } from "@/types/index";

interface FormEditProps {
    onSubmit: (data: Pet) => void;
    defaultValues: Pet;
    petData: Pet | null;
    onClose: () => void; 
    handleSave: (data: Pet) => void;
}

export default function FormEdit({ onSubmit, defaultValues, handleSave, onClose }: FormEditProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Pet>({
        defaultValues,
    });

    return (
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.logoContainer}>
                <Image
                    source={require("@/assets/images/logo.png")}
                    style={{ width: 200, height: 200, alignSelf: "center" }}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Editar Mascota</Text>

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
                                <RadioButton.Group onValueChange={onChange} value={value}>
                                    <View style={styles.radioContainer}>
                                        <RadioButton.Item label="Perro" value="Perro" />
                                        <RadioButton.Item label="Gato" value="Gato" />
                                    </View>
                                </RadioButton.Group>
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
                            rules={{
                                validate: (value) => !isNaN(value) && value >= 0 || "Edad inválida",
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => {
                                        // Verificar si el texto es vacío o un número válido
                                        const numericValue = text === "" ? "" : parseInt(text, 10);
                                        onChange(numericValue); // Pasamos el valor numérico o vacío
                                    }}
                                    value={value ? value.toString() : ""} // Aseguramos que el valor sea un string
                                    mode="outlined"
                                    keyboardType="numeric"
                                    error={!!errors.edad}
                                />
                            )}
                        />
                        {errors.edad && (
                            <HelperText type="error">{errors.edad.message}</HelperText>
                        )}
                    </View>

                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Peso</Text>
                        <Controller
                            control={control}
                            name="peso"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => {
                                        // Verificar si el texto es vacío o un número válido
                                        const numericValue = text === "" ? "" : parseInt(text, 10);
                                        onChange(numericValue); // Pasamos el valor numérico o vacío
                                    }}
                                    value={value ? value.toString() : ""} // Aseguramos que el valor sea un string
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
                                    <View key={index} style={styles.imageItem}>
                                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => {
                                                const updatedImages = value.filter((_, i) => i !== index);
                                                onChange(updatedImages);
                                            }}
                                        >
                                            <Text style={styles.deleteButtonText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={styles.imagePickerButton}
                                onPress={async () => {
                                    const result = await ImagePicker.launchImageLibraryAsync({
                                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                        allowsEditing: true,
                                        aspect: [3, 4],
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

                {/* Botones de Cancelar y Actualizar */}
                <View style={styles.buttonContainer}>
                    {/* Botón de Cancelar */}
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.submitButton, { backgroundColor: Colors.background.secondaryButton }]}
                    >
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>

                    {/* Botón de Actualizar */}
                    <TouchableOpacity
                        onPress={handleSubmit((data) => {
                            handleSave(data);
                            reset(); 
                        })}
                        style={styles.submitButton}
                    >
                        <Text style={styles.buttonText}>Actualizar Mascota</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 7,
        width: "50%",
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
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        gap: 10,
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
    logoContainer: {
        alignContent: "center",
    },
    imageItem: {
        position: "relative",
        margin: 5,
    },
    deleteButton: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: Colors.background.dark,
        borderRadius: 50,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButtonText: {
        color: Colors.text.white,
        fontSize: 12,
        fontFamily: "outfit-medium",
    },
});
