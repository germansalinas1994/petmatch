import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { RadioButton, TextInput, HelperText } from "react-native-paper";
import SkeletonItem from "@/components/SkeletonItem";
import Colors from "@/constants/Colors";
import { User } from "@/types/index";

interface FormProps {
  onSubmit: (data: User, reset: () => void) => void;
  roles: { 
    rol_id: string;
    descripcion: string; 
    telefono: string; 
    localidad: string;
  }[];
  isLoading: boolean;
  defaultValues?: User;
}

export default function UserForm({
  onSubmit,
  roles,
  isLoading,
  defaultValues,
}: FormProps) {
  console.log("Default Values en UserForm:", defaultValues);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<User>({
    defaultValues: defaultValues || {
      nombre: "",
      descripcion: "",
      rol_id: "",
      telefono: "",
      localidad: "",
    },
  });

  useEffect(() => {
    reset({
      nombre: defaultValues?.nombre || "",
      descripcion: defaultValues?.descripcion || "",
      rol_id: defaultValues?.rol_id || "",
      telefono: defaultValues?.telefono || "",
      localidad: defaultValues?.localidad || "",
    });
  }, [defaultValues, reset]);

  if (isLoading) {
    return (
      <View style={styles.inputContainer}>
        <SkeletonItem
          width="100%"
          height={40}
          borderRadius={8}
          style={{ marginBottom: 10 }}
        />
        <SkeletonItem
          width="100%"
          height={40}
          borderRadius={8}
          style={{ marginBottom: 10 }}
        />
        <SkeletonItem width="100%" height={60} borderRadius={8} />
      </View>
    );
  }

  // Opciones para las localidades
  const localidades = [
    { label: "La Plata", value: "La Plata" },
    { label: "Ensenada", value: "Ensenada" },
    { label: "Berisso", value: "Berisso" },
    { label: "CABA", value: "CABA" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.inputContainer}>
        {/* Nombre */}
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

        {/* Descripción */}
        <Text style={styles.label}>Descripción *</Text>
        <Controller
          control={control}
          name="descripcion"
          rules={{ required: "La descripción es obligatoria" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              mode="outlined"
              error={!!errors.descripcion}
            />
          )}
        />
        {errors.descripcion?.message && (
          <HelperText type="error">{errors.descripcion.message}</HelperText>
        )}

        {/* Número de Teléfono */}
        <Text style={styles.label}>Número de Teléfono *</Text>
        <Controller
          control={control}
          name="telefono"
          rules={{
            required: "El número de teléfono es obligatorio",
            pattern: {
              value: /^[0-9]+$/,
              message: "El número de teléfono debe contener solo dígitos",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value !== undefined ? value : ""}
              mode="outlined"
              keyboardType="phone-pad"
              error={!!errors.telefono}
            />
          )}
        />
        {errors.telefono?.message && (
          <HelperText type="error">{errors.telefono.message}</HelperText>
        )}

        {/* Localidad */}
        <Text style={styles.label}>Localidad *</Text>
        <Controller
          control={control}
          name="localidad"
          rules={{ required: "La localidad es obligatoria" }}
          render={({ field: { onChange, value } }) => (
            <RadioButton.Group onValueChange={onChange} value={value}>
              <View style={styles.radioContainer}>
                {localidades.map((loc) => (
                  <RadioButton.Item
                    key={loc.value}
                    label={loc.label}
                    value={loc.value}
                  />
                ))}
              </View>
            </RadioButton.Group>
          )}
        />
        {errors.localidad?.message && (
          <HelperText type="error">{errors.localidad.message}</HelperText>
        )}

        {/* Rol */}
        <Text style={styles.label}>Rol *</Text>
        <Controller
          control={control}
          name="rol_id"
          rules={{ required: "El rol es obligatorio" }}
          render={({ field: { onChange, value } }) => (
            <RadioButton.Group onValueChange={onChange} value={value}>
              <View style={styles.radioContainer}>
                {roles.map((rol) => (
                  <RadioButton.Item
                    key={rol.rol_id}
                    label={rol.descripcion}
                    value={rol.rol_id}
                  />
                ))}
              </View>
            </RadioButton.Group>
          )}
        />
        {errors.rol_id?.message && (
          <HelperText type="error">{errors.rol_id.message}</HelperText>
        )}

        {/* Botón de envío */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleSubmit((data) => onSubmit(data, reset))}
            style={styles.submitButton}
          >
            <Text style={styles.buttonText}>
              {defaultValues ? "Guardar" : "Guardar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  inputContainer: {
    padding: 10,
    marginTop: "8%",
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    fontFamily: "outfit",
  },
  input: {
    backgroundColor: Colors.background.paper,
    borderRadius: 10,
    fontFamily: "outfit",
  },
  radioContainer: {
    marginVertical: 10,
    backgroundColor: Colors.background.paper,
    borderWidth: 1,
    borderColor: Colors.background.primaryButton,
    borderRadius: 10,
    padding: 5,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  submitButton: {
    padding: 8,
    width: "50%",
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
});
