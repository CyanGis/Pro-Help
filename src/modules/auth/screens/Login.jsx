import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image, Input, Button, Icon } from "@rneui/base";

export default function Login(props) {
    const { navigation } = props;
    const [showPassword, setShowPassword] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ email: "", password: "" });

    const handleLogin = () => {
        const formattedEmail = email.trim().toLowerCase();
        const formattedPassword = password.trim();

        if (formattedEmail === "admin@email.com" && formattedPassword === "admin123") {
            navigation.replace("DashBoard");
        } else if (formattedEmail === "donante@email.com" && formattedPassword === "donante123") {
            navigation.replace("DashBoardDonante");
        } else if (formattedEmail === "beneficiario@email.com" && formattedPassword === "beneficiario123") {
            navigation.replace("DashBoardBeneficiario");
        } else {
            setError({ email: "Correo o contraseña incorrectos", password: " " });
        }
    };

    const Invitado = () => {
        navigation.replace("DashBoardInvitado");
    };

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
                <Button style={styles.buttonStyle}
                    title={"Iniciar Sesión"}
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
                <Button style={styles.buttonStyle}
                    title={"Ingresar como Invitado"}
                    onPress={Invitado}
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
    registerText: {
        marginTop: 16,
        textAlign: 'center',
        color: '#000',
        marginBottom: 16
    },
    registerLink: {
        color: 'blue',
        textDecorationLine: 'underline'
    },
    forgotPasswordText: {
        marginTop: 16,
        textAlign: 'center',
        color: 'blue',
        textDecorationLine: 'underline'
    },
    inputContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 8
    },
    input: {
        color: '#000000'
    },
    buttonStyle: {
        borderRadius: 8,
    }
});
