    import React, { useEffect, useState } from "react";
    import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
    import { Image, Input, Button, Icon } from "@rneui/base";
    import UserService from "../../../Kernel/Service";
    import AsyncStorage from "@react-native-async-storage/async-storage";
    import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
    import { authInstance } from "../../../Kernel/firebase.config"; 
    export default function Login({ navigation }) {
        const [showPassword, setShowPassword] = useState(true);
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [error, setError] = useState({ email: "", password: "" });
        {/* Guardar los datos dentro del async storage */}
        useEffect(() => {
            ( async () => {
                await AsyncStorage.removeItem("token");
            })();
        })

        const saveData = async (data) => {
            try {//recibe data y la guarda en el async storage
            await AsyncStorage.setItem('token', data);//guarda el token en el async storage
            console.log('Data saved successfully');
            } catch (e) {
            console.log('Failed to save data:', e);
            }
        };

        const validateEmail = (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        };

        const handleLogin = async () => {
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
            try {
                const data = await UserService.login(formattedEmail, formattedPassword);
    
                if (data.token) {
                    saveData(data.token);
                    const firebaseTokenData = await UserService.getFirebaseToken(data.token, formattedPassword);
    
                    if (firebaseTokenData.firebaseToken) {
                        await signInWithEmailAndPassword(authInstance, formattedEmail, formattedPassword);
                        console.log("Usuario autenticado con Firebase");
                    }
                }
                if (data.role === 'ADMIN') {
                    navigation.replace('DashBoard');
                } else {
                    console.log("Usuario no es ADMIN");
                    Alert.alert("Acceso Denegado", "Este usuario no tiene permisos de administrador.");
                }
    
            } catch (err) {
                console.error("Error durante el login: ", err);
                setError({ email: "", password: "Error en el inicio de sesión" });
            }
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
