import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image, Input, Button, Icon } from "@rneui/base";

export default function Login({ navigation }) {
    const [showPassword, setShowPassword] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ email: "", password: "" });

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLogin = () => {
        const formattedEmail = email.trim().toLowerCase();
        const formattedPassword = password.trim();

        if (!formattedEmail || !formattedPassword) {
            setError({
                email: !formattedEmail ? "El correo es obligatorio" : "",
                password: !formattedPassword ? "La contraseña es obligatoria" : ""
            });
            return;
        }

        if (!validateEmail(formattedEmail)) {
            setError({ email: "Ingresa un correo válido", password: "" });
            return;
        }

        let route = "";
        switch (formattedEmail) {
            case "admin@email.com":
                route = "DashBoard";
                break;
            case "donante@email.com":
                route = "DashBoardDonante";
                break;
            case "beneficiario@email.com":
                route = "DashBoardBeneficiario";
                break;
            default:
                setError({ email: "Correo o contraseña incorrectos", password: " " });
                return;
        }

        if (formattedPassword !== "admin123" && formattedPassword !== "donante123" && formattedPassword !== "beneficiario123") {
            setError({ email: "Correo o contraseña incorrectos", password: " " });
            return;
        }

        navigation.replace(route);
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../../../assets/logoDrawer.png')} style={styles.logo} />
            <View style={styles.formContainer}>
                <Input
                    placeholder="Correo electrónico"
                    label="Correo Electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    onChange={({ nativeEvent: { text } }) => setEmail(text)}
                    errorMessage={error.email}
                />
                <Input
                    placeholder="Contraseña"
                    label="Contraseña"
                    secureTextEntry={showPassword}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    rightIcon={
                        <Icon
                            name={showPassword ? "eye" : "eye-off"}
                            type="material-community"
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    }
                    onChange={({ nativeEvent: { text } }) => setPassword(text)}
                    errorMessage={error.password}
                />
                <Button
                    title="Iniciar Sesión"
                    buttonStyle={styles.button}
                    onPress={handleLogin}
                />
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                    <Text style={styles.registerText}>
                        ¿Aún no tienes una cuenta? <Text style={styles.registerLink}>Regístrate</Text>
                    </Text>
                </TouchableOpacity>
                <Button
                    title="Ingresar como Invitado"
                    buttonStyle={[styles.button, styles.guestButton]}
                    onPress={() => navigation.replace("DashBoardInvitado")}
                />
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
        paddingHorizontal: 20
    },
    logo: {
        width: 200,
        height: 100,
        marginBottom: 20
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    inputContainer: {
        width: '100%',
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 8
    },
    input: {
        color: '#000'
    },
    button: {
        borderRadius: 8,
        backgroundColor: '#896447',
        marginVertical: 10,
        paddingVertical: 12
    },
    guestButton: {
        backgroundColor: '#896447'
    },
    forgotPasswordText: {
        marginTop: 16,
        textAlign: 'center',
        color: '#1E88E5',
        textDecorationLine: 'underline'
    },
    registerText: {
        marginTop: 16,
        textAlign: 'center',
        color: '#000',
        marginBottom: 16
    },
    registerLink: {
        color: '#1E88E5',
        textDecorationLine: 'underline'
    }
});
