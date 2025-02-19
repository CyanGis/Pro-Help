import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image, Input, Button, Icon } from "@rneui/base";
import { isEmpty } from "lodash";
import axios from 'axios';

export default function Login(props) {
    const { navigation } = props;
    const [showPassword, setShowPassword] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ email: "", password: "" });

    const handleLogin = () => {
        if (isEmpty(email) || isEmpty(password)) {
            setError({
                email: "El correo electrónico es requerido",
                password: "La contraseña es requerida"
            });
        } else {
            setError({ email: "", password: "" });

            // Aquí se hace la petición a la API
            axios.post('https://tuapi.com/login', { email, password })
                .then((response) => {
                    console.log(response.data);
                    const user = response.data.user;
                    // Aquí puedes manejar el usuario como necesites
                })
                .catch((error) => {
                    console.log(error.response.data);
                });
        }
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../../assets/logoLogin.png')}
                style={{ width: 50, height: 50 }}
            />
            <View style={{ margin: 16 }}>
                <Input
                    placeholder="Correo electrónico"
                    label="Correo Electrónico"
                    keyboardType="email-address"
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
                    title={"Iniciar Sesión"}
                    onPress={handleLogin}
                />
                <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                    <Text style={styles.registerText}>
                        ¿Aún no tienes una cuenta? <Text style={styles.registerLink}>Regístrate</Text>
                    </Text>
                </TouchableOpacity>
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
    registerText: {
        marginTop: 16,
        textAlign: 'center',
        color: '#000'
    },
    registerLink: {
        color: 'blue',
        textDecorationLine: 'underline'
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
