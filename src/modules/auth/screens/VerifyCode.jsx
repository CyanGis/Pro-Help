// src/modules/auth/screens/VerifyCode.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from "@rneui/base";
import axios from 'axios';

export default function VerifyCode(props) {
    const { navigation, route } = props;
    const { phoneNumber } = route.params;
    const [code, setCode] = useState("");
    const [error, setError] = useState({ code: "" });

    const handleVerifyCode = () => {
        if (code === "") {
            setError({ code: "El código es requerido" });
        } else {
            setError({ code: "" });

            // Aquí se hace la petición a la API para verificar el código
            axios.post('https://tuapi.com/verify-code', { phoneNumber, code })
                .then((response) => {
                    console.log(response.data);
                    // Navegar a la pantalla de cambio de contraseña si el código es correcto
                    navigation.navigate('ResetPassword', { phoneNumber });
                })
                .catch((error) => {
                    console.log(error.response.data);
                    setError({ code: "Código incorrecto. Inténtalo de nuevo." });
                });
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verificación de Código</Text>
            <Input
                placeholder="Código"
                label="Código"
                keyboardType="number-pad"
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                onChange={({ nativeEvent: { text } }) => setCode(text)}
                errorMessage={error.code}
            />
            <Button
                title={"Verificar Código"}
                onPress={handleVerifyCode}
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
