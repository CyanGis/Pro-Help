// src/modules/auth/screens/PhoneNumber.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from "@rneui/base";
import axios from 'axios';

export default function PhoneNumber(props) {
    const { navigation } = props;
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState({ phoneNumber: "" });

    const handleSendCode = () => {
        if (phoneNumber === "") {
            setError({ phoneNumber: "El número de teléfono es requerido" });
        } else {
            setError({ phoneNumber: "" });

            // Aquí se hace la petición a la API para enviar el código
            axios.post('https://tuapi.com/send-code', { phoneNumber })
                .then((response) => {
                    console.log(response.data);
                    // Navegar a la pantalla de verificación del código
                    navigation.navigate('VerifyCode', { phoneNumber });
                })
                .catch((error) => {
                    console.log(error.response.data);
                    setError({ phoneNumber: "Error al enviar el código. Inténtalo de nuevo." });
                });
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verificación de Teléfono</Text>
            <Input
                placeholder="Número de teléfono"
                label="Número de Teléfono"
                keyboardType="phone-pad"
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                onChange={({ nativeEvent: { text } }) => setPhoneNumber(text)}
                errorMessage={error.phoneNumber}
            />
            <Button
                title={"Enviar Código"}
                onPress={handleSendCode}
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
