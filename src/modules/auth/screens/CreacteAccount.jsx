import React, { useState } from "react";
import { View, StyleSheet } from 'react-native';
import { Image, Input, Button, Icon } from "@rneui/base";
import { isEmpty } from "lodash";
import axios from 'axios';

export default function CreateAccount(props) {
    const { navigation } = props;
    const [showPassword, setShowPassword] = useState(true);
    const [showPassword2, setShowPassword2] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({ email: "", password: "", confirmPassword: "" });

    const handleCreateAccount = () => {
        if (isEmpty(email) || isEmpty(password) || isEmpty(confirmPassword)) {
            setError({
                email: isEmpty(email) ? "El correo electrónico es requerido" : "",
                password: isEmpty(password) ? "La contraseña es requerida" : "",
                confirmPassword: isEmpty(confirmPassword) ? "La confirmación de la contraseña es requerida" : ""
            });
        } else if (password !== confirmPassword) {
            setError({
                email: "",
                password: "Las contraseñas no coinciden",
                confirmPassword: "Las contraseñas no coinciden"
            });
        } else {
            setError({ email: "", password: "", confirmPassword: "" });
            
            axios.post('https://tuapi.com/register', { email, password })
                .then((response) => {
                    console.log(response.data);
                    // Aquí puedes manejar la respuesta y navegación según necesites
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
                <Input
                    placeholder="Confirmar Contraseña"
                    label="Confirmar contraseña"
                    secureTextEntry={showPassword2}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    rightIcon={
                        <Icon
                            name={showPassword2 ? "eye" : "eye-off"}
                            type="material-community"
                            onPress={() => setShowPassword2(!showPassword2)}
                        />
                    }
                    onChange={({ nativeEvent: { text } }) => setConfirmPassword(text)}
                    errorMessage={error.confirmPassword}
                />
                <Button
                    title={"Crear Cuenta"}
                    onPress={handleCreateAccount}
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
        backgroundColor: '#AFCCD0'
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
