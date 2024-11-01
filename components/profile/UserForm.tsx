import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { RadioButton, TextInput, HelperText } from "react-native-paper";
import SkeletonItem from "@/components/SkeletonItem";
import Colors from "@/constants/Colors";
import {User} from "@/types/index";


interface FormProps {
  onSubmit: (data: User, reset: () => void) => void;
  roles: { rol_id: string; descripcion: string }[];
  isLoading: boolean;
  defaultValues?: User; 
}

export default function UserForm({
  onSubmit,
  roles,
  isLoading,
  defaultValues,
}: FormProps) {
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
    },
  });

  if (isLoading) {
    return (
      <View style={styles.inputContainer}>
        <SkeletonItem
          width="100%"
          // width="100%"
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

  return (
    <View style={styles.inputContainer}>
      {/* Título */}
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

      {/* Prioridad con RadioButton */}
      <Text style={styles.label}>Rol *</Text>
      <Controller
        control={control}
        name="rol_id"
        rules={{ required: "La prioridad es obligatoria" }}
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

      <View style={styles.inputContainer}>
        {/* Resto del código igual */}
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
  );
}

const styles = StyleSheet.create({
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
  submitButton: {
    padding: 8,
    width: "50%",
    alignSelf: "center",
    marginTop: 20,
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
