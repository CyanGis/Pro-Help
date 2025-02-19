// src/modules/auth/screens/ResetPassword.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from "@rneui/base";
import axios from 'axios';

export default function ResetPassword(props) {
    const { navigation, route } = props;
    const { phoneNumber } = route.params;
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({ password: "", confirmPassword: "" });

    const handleResetPassword = () => {
        if (password === "" || confirmPassword === "") {
            setError({
                password: password === "" ? "La contraseña es requerida" : "",
                confirmPassword: confirmPassword === "" ? "La confirmación de la contraseña es requerida" : ""
            });
        } else if (password !== confirmPassword) {
            setError({
                password: "Las contraseñas no coinciden",
                confirmPassword: "Las contraseñas no coinciden"
            });
        } else {
            setError({ password: "", confirmPassword: "" });

            // Aquí se hace la petición a la API para restablecer la contraseña
            axios.post('https://tuapi.com/reset-password', { phoneNumber, password })
                .then((response) => {
                    console.log(response.data);
                    // Navegar al Login después de restablecer la contraseña
                    navigation.navigate('Login');
                })
                .catch((error) => {
                    console.log(error.response.data);
                    setError({ password: "Error al restablecer la contraseña. Inténtalo de nuevo." });
                });
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Restablecer Contraseña</Text>
            <Input
                placeholder="Nueva Contraseña"
                label="Nueva Contraseña"
                secureTextEntry={true}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                onChange={({ nativeEvent: { text } }) => setPassword(text)}
                errorMessage={error.password}
            />
            <Input
                placeholder="Confirmar Contraseña"
                label="Confirmar Contraseña"
                secureTextEntry={true}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                onChange={({ nativeEvent: { text } }) => setConfirmPassword(text)}
                errorMessage={error.confirmPassword}
            />
            <Button
                title={"Restablecer Contraseña"}
                onPress={handleResetPassword}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#AFCCD0'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16
    },
    inputContainer: {
        width: '100%',
        backgroundColor: '#ffffff', // Color de fondo blanco
        borderRadius: 8, // Bordes redondeados
        paddingHorizontal: 10, // Espacio horizontal interno
        paddingVertical: 5, // Espacio vertical interno
        marginVertical: 8 // Margen vertical
    },
    input: {
        color: '#000000' // Color de texto negro
    }
});
