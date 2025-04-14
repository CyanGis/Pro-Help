import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Image, Input, Button, Icon } from "@rneui/base";
import { Picker } from '@react-native-picker/picker';
import { isEmpty } from "lodash";
import axios from 'axios';

export default function CreateAccount({ navigation }) {
    const [showPassword, setShowPassword] = useState(true);
    const [showPassword2, setShowPassword2] = useState(true);
    const [name, setName] = useState("");
    const [lastName, setFirstLastName] = useState("");
    const [sex, setSex] = useState("");
    const [phone, setPhone] = useState("");
    const [direccion, setDireccion] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({
        name: "", lastName: "", sex: "", phone: "",
        direccion: "", email: "", password: "", confirmPassword: ""
    });

    const handleCreateAccount = async () => {
        if (isEmpty(name) || isEmpty(lastName) || isEmpty(sex) ||
            isEmpty(phone) || isEmpty(direccion) || isEmpty(email) || isEmpty(password) || isEmpty(confirmPassword)) {
            setError({
                name: isEmpty(name) ? "El nombre es requerido" : "",
                lastName: isEmpty(lastName) ? "El primer apellido es requerido" : "",
                sex: isEmpty(sex) ? "El sexo es requerido" : "",
                phone: isEmpty(phone) ? "El número de teléfono es requerido" : "",
                direccion: isEmpty(direccion) ? "La dirección es requerida" : "",
                email: isEmpty(email) ? "El correo electrónico es requerido" : "",
                password: isEmpty(password) ? "La contraseña es requerida" : "",
                confirmPassword: isEmpty(confirmPassword) ? "La confirmación de la contraseña es requerida" : ""
            });
            return;
        }

        if (password !== confirmPassword) {
            setError(prev => ({
                ...prev,
                password: "Las contraseñas no coinciden",
                confirmPassword: "Las contraseñas no coinciden"
            }));
            return;
        }

        setError({
            name: "", lastName: "", sex: "", phone: "",
            direccion: "", email: "", password: "", confirmPassword: ""
        });

        try {
            const userData = {
                name,
                lastName,
                sexo: sex,
                phone,
                direccion,
                email,
                password,
                role: "USER"
            };

            const response = await axios.post(
                'http://192.168.0.3:8080/api/auth/register',
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status >= 200 && response.status < 300) {
                Alert.alert('¡Éxito!', 'Tu cuenta ha sido creada correctamente.', [
                    { text: 'OK', onPress: () => navigation.navigate('DashBoardDonante') }
                ]);
            } else {
                Alert.alert('Error', 'Hubo un problema al registrar tu cuenta, por favor intenta nuevamente.');
            }

        } catch (error) {
            console.log("Error en el registro:", error.response?.data || error.message);
            Alert.alert('Error', 'Hubo un problema con la conexión, por favor intenta nuevamente.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={100}
        >
            <ScrollView
                contentContainerStyle={styles.scrollView}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
            >
                <Image
                    source={require('../../../../assets/logoLogin.png')}
                    style={styles.logo}
                />
                <View style={styles.formContainer}>
                    <Input
                        placeholder="Nombre"
                        label="Nombre:"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChange={({ nativeEvent: { text } }) => setName(text)}
                        errorMessage={error.name}
                    />
                    <Input
                        placeholder="Primer Apellido"
                        label="Primer Apellido:"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChange={({ nativeEvent: { text } }) => setFirstLastName(text)}
                        errorMessage={error.lastName}
                    />
                    <View style={styles.pickerWrapper}>
                        <Text style={styles.label}>Sexo:</Text>
                        <Picker
                            selectedValue={sex}
                            style={styles.picker}
                            onValueChange={(itemValue) => setSex(itemValue)}
                        >
                            <Picker.Item label="Masculino" value="H" />
                            <Picker.Item label="Femenino" value="M" />
                            <Picker.Item label="Otro" value="O" />
                        </Picker>
                        {!!error.sex && <Text style={styles.errorText}>{error.sex}</Text>}
                    </View>

                    <Input
                        placeholder="Número de Teléfono"
                        label="Teléfono:"
                        keyboardType="phone-pad"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChange={({ nativeEvent: { text } }) => setPhone(text)}
                        errorMessage={error.phone}
                    />
                    <Input
                        placeholder="Dirección"
                        label="Dirección:"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChange={({ nativeEvent: { text } }) => setDireccion(text)}
                        errorMessage={error.direccion}
                    />
                    <Input
                        placeholder="Correo Electrónico"
                        label="Correo Electrónico:"
                        keyboardType="email-address" // CORREGIDO
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChange={({ nativeEvent: { text } }) => setEmail(text)}
                        errorMessage={error.email}
                    />
                    <Input
                        placeholder="Contraseña"
                        label="Contraseña:"
                        secureTextEntry={showPassword}
                        rightIcon={
                            <Icon
                                name={showPassword ? "eye" : "eye-off"}
                                type="material-community"
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChange={({ nativeEvent: { text } }) => setPassword(text)}
                        errorMessage={error.password}
                    />
                    <Input
                        placeholder="Confirmar Contraseña"
                        label="Confirmar Contraseña:"
                        secureTextEntry={showPassword2}
                        rightIcon={
                            <Icon
                                name={showPassword2 ? "eye" : "eye-off"}
                                type="material-community"
                                onPress={() => setShowPassword2(!showPassword2)}
                            />
                        }
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChange={({ nativeEvent: { text } }) => setConfirmPassword(text)}
                        errorMessage={error.confirmPassword}
                    />
                    <Button title="Crear Cuenta" onPress={handleCreateAccount} buttonStyle={styles.button} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#AFCCD0'
    },
    scrollView: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 20,
        paddingBottom: 50
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20
    },
    formContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5
    },
    inputContainer: {
        borderBottomWidth: 0,
        marginBottom: 16
    },
    input: {
        backgroundColor: '#e9ecef',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        fontSize: 16
    },
    pickerWrapper: {
        marginBottom: 16
    },
    picker: {
        backgroundColor: '#e9ecef',
        borderRadius: 10,
        paddingHorizontal: 10
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        marginBottom: 5,
        marginRight: 5
    },
    errorText: {
        color: '#e63946',
        fontSize: 12,
        marginTop: 5
    },
    button: {
        backgroundColor: '#896447',
        borderRadius: 10,
        paddingVertical: 14,
        marginTop: 20
    }
    
});
