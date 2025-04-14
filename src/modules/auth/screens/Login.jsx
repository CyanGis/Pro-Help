import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Image, Input, Button, Icon } from "@rneui/base";
import UserService from "../../../Kernel/Service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authInstance } from "../../../Kernel/firebase.config";

export default function Login({ navigation }) {
    const [showPassword, setShowPassword] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ email: "", password: "" });

    useEffect(() => {
        (async () => {
            await AsyncStorage.removeItem("token");
        })();
    }, []);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLogin = async () => {
        const formattedEmail = email.trim();
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

        try {
            const data = await UserService.login(formattedEmail, formattedPassword);

            if (data.token) {
                await AsyncStorage.setItem('token', data.token);
                const firebaseTokenData = await UserService.getFirebaseToken(data.token, formattedPassword);

                if (firebaseTokenData.firebaseToken) {
                    await signInWithEmailAndPassword(authInstance, formattedEmail, formattedPassword);
                    console.log("Usuario autenticado con Firebase");
                }

                navigation.replace(data.role === 'ADMIN' ? 'DashBoard' : 'DashBoardDonante');
            }
        } catch (err) {
            console.error("Error durante el login: ", err);
            setError({ email: "", password: "Credenciales incorrectas" });
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../../../assets/logoDrawer.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>¡Bienvenido!</Text>

                <Input
                    placeholder="Correo electrónico"
                    leftIcon={{ type: 'material', name: 'email' }}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    errorMessage={error.email}
                />

                <Input
                    placeholder="Contraseña"
                    secureTextEntry={showPassword}
                    leftIcon={{ type: 'material', name: 'lock' }}
                    rightIcon={
                        <Icon
                            name={showPassword ? "visibility" : "visibility-off"}
                            type="material"
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    }
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    errorMessage={error.password}
                />

                <Button
                    title="Iniciar Sesión"
                    buttonStyle={styles.loginButton}
                    titleStyle={{ fontWeight: 'bold' }}
                    onPress={handleLogin}
                />

                <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                    <Text style={styles.registerText}>
                        ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate</Text>
                    </Text>
                </TouchableOpacity>

                <Button
                    title="Ingresar como Invitado"
                    type="outline"
                    buttonStyle={styles.guestButton}
                    titleStyle={{ color: '#896447' }}
                    onPress={() => navigation.replace('DashBoardInvitado')}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#AFCCD0',
        justifyContent: 'center',
        padding: 20
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 180,
        height: 80,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    inputContainer: {
        borderBottomWidth: 0,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    input: {
        color: '#333',
    },
    loginButton: {
        backgroundColor: '#896447',
        borderRadius: 10,
        paddingVertical: 12,
        marginVertical: 10,
    },
    registerText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#333',
    },
    registerLink: {
        color: '#896447',
        fontWeight: '600',
    },
    guestButton: {
        borderColor: '#896447',
        borderRadius: 10,
        marginTop: 10,
        paddingVertical: 12,
    }
});
