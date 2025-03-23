import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { Input, Button } from "@rneui/base";

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handlePasswordReset = () => {
        if (!email.trim()) {
            setError("El correo electrónico es requerido");
            return;
        }

        if (!validateEmail(email)) {
            setError("Ingresa un correo válido");
            return;
        }

        setError("");

        Alert.alert(
            "Recuperación de contraseña",
            "Se ha enviado un enlace para restablecer la contraseña a tu correo.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
        );
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../../../assets/logoLogin.png')} style={styles.logo} />
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <View style={styles.formContainer}>
                <Input
                    placeholder="Correo electrónico"
                    label="Correo Electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    inputContainerStyle={styles.inputContainer}
                    onChangeText={(text) => {
                        setEmail(text);
                        setError(""); // Limpia el error al escribir
                    }}
                    errorMessage={error}
                />
                <Button title="Enviar" onPress={handlePasswordReset} buttonStyle={styles.button} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#AFCCD0',
        padding: 20
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5
    },
    inputContainer: {
        width: '100%',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#896447',
        borderRadius: 8
    }
});
