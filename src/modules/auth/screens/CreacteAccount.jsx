import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Image, Input, Button, Icon } from "@rneui/base";
import { Picker } from '@react-native-picker/picker';
import { isEmpty } from "lodash";
import axios from 'axios';

export default function CreateAccount({ navigation }) {
    const [showPassword, setShowPassword] = useState(true);
    const [showPassword2, setShowPassword2] = useState(true);
    const [name, setName] = useState("");
    const [firstLastName, setFirstLastName] = useState("");
    const [sex, setSex] = useState("");
    const [role, setRole] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({
        name: "", firstLastName: "", sex: "", role: "", phone: "",
        address: "", email: "", password: "", confirmPassword: ""
    });

    const handleCreateAccount = () => {
        if (isEmpty(name) || isEmpty(firstLastName) || isEmpty(sex) || isEmpty(role) || 
            isEmpty(phone) || isEmpty(address) || isEmpty(email) || isEmpty(password) || isEmpty(confirmPassword)) {
            setError({
                name: isEmpty(name) ? "El nombre es requerido" : "",
                firstLastName: isEmpty(firstLastName) ? "El primer apellido es requerido" : "",
                sex: isEmpty(sex) ? "El sexo es requerido" : "",
                role: isEmpty(role) ? "El rol es requerido" : "",
                phone: isEmpty(phone) ? "El número de teléfono es requerido" : "",
                address: isEmpty(address) ? "La dirección es requerida" : "",
                email: isEmpty(email) ? "El correo electrónico es requerido" : "",
                password: isEmpty(password) ? "La contraseña es requerida" : "",
                confirmPassword: isEmpty(confirmPassword) ? "La confirmación de la contraseña es requerida" : ""
            });
        } else if (password !== confirmPassword) {
            setError({
                ...error,
                password: "Las contraseñas no coinciden",
                confirmPassword: "Las contraseñas no coinciden"
            });
        } else {
            setError({
                name: "", firstLastName: "", sex: "", role: "", phone: "",
                address: "", email: "", password: "", confirmPassword: ""
            });

            axios.post('https://tuapi.com/register', { 
                name, firstLastName, sex, role, phone, address, email, password 
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error.response.data);
            });
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
                style={{ width: 50, height: 50, marginBottom: 20 }}
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
                        errorMessage={error.firstLastName}
                    />

                    <View style={styles.row}>
                        <View style={styles.pickerWrapper}>
                            <Text style={styles.label}>Sexo:</Text>
                            <Picker
                                selectedValue={sex}
                                style={styles.picker}
                                onValueChange={(itemValue) => setSex(itemValue)}
                            >
                                <Picker.Item label="Masculino" value="male" />
                                <Picker.Item label="Femenino" value="female" />
                                <Picker.Item label="Otro" value="other" />
                            </Picker>
                        </View>

                        <View style={styles.pickerWrapper}>
                            <Text style={styles.label}>Rol:</Text>
                            <Picker
                                selectedValue={role}
                                style={styles.picker}
                                onValueChange={(itemValue) => setRole(itemValue)}
                            >
                                <Picker.Item label="Donante" value="donante" />
                                <Picker.Item label="Beneficiario" value="beneficiario" />
                            </Picker>
                        </View>
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
                        onChange={({ nativeEvent: { text } }) => setAddress(text)}
                        errorMessage={error.address}
                    />
                    <Input
                        placeholder="Correo Electrónico"
                        label="Correo Electrónico:"
                        keyboardType="email-address"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChange={({ nativeEvent: { text } }) => setEmail(text)}
                        errorMessage={error.email}
                    />
                    <Input
                        placeholder="Contraseña"
                        label="Contraseña:"
                        secureTextEntry={showPassword}
                        rightIcon={<Icon name={showPassword ? "eye" : "eye-off"} type="material-community" onPress={() => setShowPassword(!showPassword)} />}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChange={({ nativeEvent: { text } }) => setPassword(text)}
                        errorMessage={error.password}
                    />
                    <Input
                        placeholder="Confirmar Contraseña"
                        label="Confirmar Contraseña:"
                        secureTextEntry={showPassword2}
                        rightIcon={<Icon name={showPassword2 ? "eye" : "eye-off"} type="material-community" onPress={() => setShowPassword2(!showPassword2)} />}
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
        borderRadius: 10, 
        padding: 20 
    },
    row: { 
        flexDirection: "row", 
        justifyContent: "space-between" 
    },
    pickerWrapper: { 
        width: '48%' 
    },
    picker: { 
        backgroundColor: '#f2f2f2', 
        borderRadius: 8 
    },
    inputContainer: { 
        width: '100%' 
    },
    input: { 
        color: '#000' },
    button: { 
        width: '100%', 
        marginTop: 10 
    }
});
