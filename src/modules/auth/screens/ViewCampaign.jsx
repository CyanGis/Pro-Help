import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Linking } from 'react-native';
import { ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { Modal } from 'react-native';
import { TextInput } from 'react-native';
import payIt from '../../../Kernel/payIt';
import AsyncStorage from '@react-native-async-storage/async-storage';


const imagenes = {
    '/img-camp/img-1.png': require("../../../../assets/img-camp/img-1.png"),
    '/img-camp/img-2.png': require("../../../../assets/img-camp/img-2.png"),
    '/img-camp/img-3.png': require("../../../../assets/img-camp/img-3.png"),
    '/img-camp/img-4.png': require("../../../../assets/img-camp/img-4.png"),
    '/img-camp/img-5.png': require("../../../../assets/img-camp/img-5.png"),
    '/img-camp/img-6.png': require("../../../../assets/img-camp/img-6.png"),
    '/img-camp/img-7.png': require("../../../../assets/img-camp/img-7.jpg"),
    '/img-camp/img-8.png': require("../../../../assets/img-camp/img-8.jpg"),
    '/img-camp/img-9.png': require("../../../../assets/img-camp/img-9.jpg"),
};

export default function ViewCampaign({ route }) {
    const [totalDonations, setTotalDonations] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    //realizar donación
    const amounts = [1000, 500, 400, 350, 300, 260];
    const [isOpen, setIsOpen] = useState(false);

    //estados para el modal donaciones
    const [donationAmount, setDonationAmount] = useState('');
    const [selectedArticulos, setSelectedArticulos] = useState({});

    const [profile, setProfile] = useState({});

    const handleCantidadChange = (nombre, cantidad) => {
        setSelectedArticulos(prev => ({
            ...prev,
            [nombre]: cantidad,
        }));
    };

    const getProfile = async () => {
        const token = await AsyncStorage.getItem("tokenCampaign");
        console.log("Token:", token);
        if (token) {
            try {
                const response = await axios.get("http://192.168.1.80:8080/api/adminuser/get-profile",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}}`,
                        },
                    }
                )
                setProfile(response.data.user);
                AsyncStorage.setItem("profileInfo", JSON.stringify(response.data.user));
                console.log("Perfil obtenido:", response.data.user);
                return response.data.user;
            } catch (error) {
                console.error("Error al obtener el perfil:", error);
            }
        } else {
            console.log("Token no encontrado");
        }
    }

    useEffect(() => {

        getProfile();
    }, []);

    const handleDonationSubmit = async () => {
        setIsOpen(false);

        try {
            if (recurso === "insumo") {
                // Convertir a formato que espera el backend
                const articulosDonados = Object.entries(selectedArticulos)
                    .filter(([_, cantidad]) => cantidad > 0)
                    .map(([nombre, cantidad]) => ({
                        nombre,  // Mantener en español si es lo que espera el backend
                        cantidad: parseInt(cantidad)  // Asegurar que es número
                    }));



                const token = await AsyncStorage.getItem('token');

                console.log("Payload a enviar:", {
                    campaignId: id,
                    donaciones: articulosDonados,  // Usar 'donaciones' en lugar de 'donations'
                    donorId: profile.id,
                    email: profile.email,
                    name: profile.name,
                    phone: profile.phone,
                    recurso: "insumo"
                });

                const response = await axios.post(
                    'http://192.168.1.80:8080/api/pre-donation/pre-donate',
                    {
                        campaignId: id,
                        donaciones: articulosDonados,  // Nombre en español
                        donorId: profile.id,
                        email: profile.email,
                        name: profile.name,
                        phone: profile.phone,
                        recurso: "insumo",
                        tipo: "insumo"  // Algunos backends piden este campo adicional
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                console.log("Respuesta completa:", response);



                fetchDonations();
            } else {
                const token = await AsyncStorage.getItem('token');
                const nuevoPago = {
                    campaignId: id,
                    amount: parseFloat(donationAmount),
                    donorId: profile.id,
                    email: profile.email,
                    phone: profile.phone,
                    name: profile.name,
                    currency_code: 'USD',
                    token: token, 
                }
                console.log("Payload a enviar:", nuevoPago);
                try {
                    const donate = await payIt.payTo(nuevoPago);
                } catch (error) {

                }finally{
                    
                }

            }
        } catch (error) {
            console.error("Error completo:", error);
            console.error("Datos del error:", error.response?.data);
        } finally {
            setSelectedArticulos({});
            setDonationAmount('');
        }
    };

    const { item } = route.params;
    const {
        nombre: titulo,
        descripcion,
        image: imagen,
        categoria,
        recursoTipo: recurso,
        fechaInicio,
        fechaFin,
        id,
        cantidad: meta,
        objeto
    } = item; // Desestructuración completa aquí
    const direccion = item.location.address;
    const navigation = useNavigation();

    // Función para obtener las donaciones
    const fetchDonations = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let url;
            let response;

            if (recurso === "insumo") {
                url = `http://192.168.1.80:8080/api/donations/total-insumos/${id}`;
                response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });


                setTotalDonations(response.data);
            } else {
                url = `http://192.168.1.80:8080/api/donations/campaign/${id}`;
                response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const total = response.data.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
                setTotalDonations(total);
            }

            // Calcular progreso
            const cantidadNumerica = parseFloat(meta.replace(/,/g, ''));
            const newProgress = (totalDonations / cantidadNumerica) * 100;
            setProgress(Math.min(newProgress, 100));

        } catch (error) {
            console.error("Error al obtener donaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, [id, recurso]);



    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>{titulo}</Text>
            </View>

            {/* Aquí el ScrollView */}
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Image source={imagenes[imagen]} style={styles.image} />
                <Text style={styles.description}>Descripción: {descripcion}</Text>
                <Text style={styles.category}>Categoría: {categoria}</Text>
                <Text style={styles.resource}>Tipo: {recurso}</Text>
                <Text style={styles.address}>Dirección: {direccion ? direccion : 'No disponible'}</Text>
                <Text style={styles.date}>Fecha inicio: {fechaInicio ? fechaInicio : 'No disponible'}</Text>
                <Text style={styles.date}>Fecha fin: {fechaFin ? fechaFin : 'No disponible'}</Text>
                <Text style={styles.progressLabel}>Progreso:</Text>

                {/* Sección de progreso */}
                <View style={styles.progressSection}>
                    <Text style={styles.progressTitle}>
                        {recurso === "insumo" ? (
                            <Text>
                                <Text style={styles.highlight}>{totalDonations}</Text> recaudados de{' '}
                                <Text style={styles.highlight}>{meta} Artículos</Text>
                            </Text>
                        ) : (
                            <Text>
                                <Text style={styles.highlight}>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDonations)}
                                </Text>{' '}
                                recaudados de{' '}
                                <Text style={styles.highlight}>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(meta.replace(/,/g, '')))}
                                </Text>
                            </Text>
                        )}
                    </Text>

                    {recurso !== "insumo" && <ProgressBar progress={progress} />}

                    {recurso === "insumo" && totalDonations < parseInt(meta) && (
                        <Text style={styles.alertText}>
                            ¡Aún necesitamos más artículos para completar los recursos!
                        </Text>
                    )}

                    {recurso === "insumo" && totalDonations >= parseInt(meta) && (
                        <Text style={styles.successText}>
                            ¡Gracias por tu apoyo! Ya completamos los artículos necesarios.
                        </Text>
                    )}
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Suscribirse a la campaña</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsOpen(true)}
                >
                    <Text style={styles.buttonText}>Realizar donación</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                visible={isOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsOpen(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {recurso === "insumo"
                                ? "Selecciona los artículos para donar"
                                : "Selecciona un monto para donar"}
                        </Text>

                        {recurso !== "insumo" ? (
                            <>
                                <View style={styles.amountsContainer}>
                                    {amounts.map((amount) => (
                                        <TouchableOpacity
                                            key={amount}
                                            style={[
                                                styles.amountButton,
                                                donationAmount === amount.toString() && styles.selectedAmount
                                            ]}
                                            onPress={() => setDonationAmount(amount.toString())}
                                        >
                                            <Text style={styles.amountText}>${amount}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={styles.customAmountContainer}>
                                    <Text style={styles.currencySymbol}>$</Text>
                                    <TextInput
                                        style={styles.amountInput}
                                        value={donationAmount}
                                        onChangeText={(text) => {
                                            if (text === '' || /^\d+(\.\d{0,2})?$/.test(text)) {
                                                setDonationAmount(text);
                                            }
                                        }}
                                        keyboardType="numeric"
                                        placeholder="Otra cantidad"
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            </>
                        ) : (
                            <ScrollView style={styles.articlesContainer}>
                                {objeto?.articulos?.map((articulo) => (
                                    <View key={articulo.nombre} style={styles.articleItem}>
                                        <View style={styles.articleInfo}>
                                            <Text style={styles.articleName}>{articulo.nombre}</Text>
                                            <Text style={styles.articleMeta}>Meta: {articulo.cantidad}</Text>
                                        </View>
                                        <TextInput
                                            style={styles.articleInput}
                                            value={selectedArticulos[articulo.nombre]?.toString() || ''}
                                            onChangeText={(text) => handleCantidadChange(articulo.nombre, text)}
                                            keyboardType="numeric"
                                            placeholder="Cantidad"
                                            placeholderTextColor="#999"
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsOpen(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.donateButton]}
                                onPress={handleDonationSubmit}
                            >
                                <Text style={styles.buttonText}>Donar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7e7e7',
    },
    header: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
        backgroundColor: '#AFCCD0',
        borderWidth: 1,
        borderColor: 'gray',
    },
    backButton: {
        padding: 10,
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginRight: 30,
    },
    image: { width: '100%', height: 200, borderRadius: 10 },
    description: { marginTop: 10, fontSize: 16 },
    category: { marginTop: 5, color: 'gray' },
    resource: { marginTop: 5, color: 'blue' },
    address: { marginTop: 5, color: 'black' },
    date: { marginTop: 5, color: 'green' },
    progress: { marginTop: 5, color: 'brown' },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#AFCCD0',
        borderRadius: 5,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: '#ccc',
    },
    progressLabel: {
        marginTop: 5,
        fontWeight: 'bold',
        color: '#444',
    },
    progressContainer: {
        height: 20,
        width: '100%',
        backgroundColor: '#d1d1d1',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
        marginBottom: 5,
    },

    progressBarCustom: {
        height: '100%',
        backgroundColor: '#4CAF50', // verde bonito
        borderRadius: 10,
    },

    percentageText: {
        textAlign: 'right',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    // Nuevos estilos para el modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    amountsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    amountButton: {
        width: '30%',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        alignItems: 'center',
    },
    selectedAmount: {
        backgroundColor: '#AFCCD0',
    },
    amountText: {
        fontSize: 16,
    },
    customAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    currencySymbol: {
        fontSize: 18,
        marginRight: 5,
    },
    amountInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    articlesContainer: {
        maxHeight: 200,
        marginBottom: 20,
    },
    articleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    articleInfo: {
        flex: 1,
    },
    articleName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    articleMeta: {
        fontSize: 14,
        color: '#666',
    },
    articleInput: {
        width: 80,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
    },
    donateButton: {
        backgroundColor: '#2ecc71',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});