import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import UserService from '../../Kernel/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Historial() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Obtener el token desde AsyncStorage
        const fetchUsuarios = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                console.log('TOKEN:', token);
        
                if (token) {
                    const response = await UserService.getAllUsers(token);
                    console.log('Usuarios:', response);
                    setUsuarios(response?.users || response);
                } else {
                    console.log('Token no encontrado');
                    setError('Token no encontrado');
                }
            } catch (err) {
                console.log('ERROR AL CARGAR:', err);
                setError('Error al cargar los usuarios');
            } finally {
                setLoading(false);
            }
        };        

        fetchUsuarios();
    }, []);  // Dependencias vacías para que se ejecute solo al montar el componente

    const renderItem = ({ item }) => (
        <View style={styles.userContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            {/* <Text style={styles.campaignName}>Participó en: {item.campaign}</Text> */}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial de Usuarios</Text>
            {loading ? (
                <Text>Cargando...</Text>
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    data={usuarios}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    userContainer: {
        marginBottom: 15,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    campaignName: {
        fontSize: 16,
        color: '#555',
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
});
