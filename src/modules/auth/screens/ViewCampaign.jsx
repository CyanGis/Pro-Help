import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Linking } from 'react-native';
import { ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
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
    const [articulos, setArticulos] = useState(objeto?.articulos || []);

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
                url = `http://192.168.0.3:8080/api/donations/total-insumos/${id}`;
                response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Response de donaciones:", response.data);

                setTotalDonations(response.data);
            } else {
                url = `http://192.168.0.3:8080/api/donations/campaign/${id}`;
                response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Response de donaciones:", response.data);
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
                    onPress={() => {
                        const url = `https://www.paypal.com/donate?hosted_button_id=XXXXXXXX`;
                        Linking.openURL(url).catch(err => console.error("Error abriendo PayPal", err));
                    }}
                >
                    <Text style={styles.buttonText}>Realizar donación</Text>
                </TouchableOpacity>
            </ScrollView>
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
});