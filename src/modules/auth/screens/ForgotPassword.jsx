import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from 'react-native';
import { Input, Button } from "@rneui/base";
import axios from 'axios';

export default function ForgotPassword(props) {
    const { navigation } = props;
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handlePasswordReset = () => {
        if (email === "") {
            setMessage("El correo electrónico es requerido");
        } else {
            // Aquí se hace la petición a la API
            axios.post('https://tuapi.com/forgot-password', { email })
                .then((response) => {
                    console.log(response.data);
                    setMessage("Se ha enviado un enlace para restablecer la contraseña a tu correo electrónico.");
                })
                .catch((error) => {
                    console.log(error.response.data);
                    setMessage("Error al enviar el enlace. Inténtalo de nuevo.");
                });
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../../assets/logoLogin.png')}
                style={{ width: 50, height: 50 }}
            />
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <View style={{ margin: 16 }}>
                <Input
                    placeholder="Correo electrónico"
                    label="Correo Electrónico"
                    keyboardType="email-address"
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    onChange={({ nativeEvent: { text } }) => setEmail(text)}
                />
                <Button
                    title={"Enviar"}
                    onPress={handlePasswordReset}
                />
                {/* Mostrar mensaje de error o éxito */}
                {message !== "" && <Text style={styles.message}>{message}</Text>}
            </View>
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
    },
    message: {
        marginTop: 16,
        textAlign: 'center',
        color: '#000',
        fontSize: 16,
    },
    otherMethodText: {
        marginTop: 16,
        textAlign: 'center',
        color: 'blue',
        textDecorationLine: 'underline'
    }
});
