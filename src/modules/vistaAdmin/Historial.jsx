import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function Historial() {
    // Suponiendo que estos son los usuarios que participaron en las campañas
    const [usuarios, setUsuarios] = useState([
        { id: '1', name: 'Juan Pérez', campaign: 'Campaña de Donación' },
        { id: '2', name: 'Ana Gómez', campaign: 'Campaña de Reciclaje' },
        { id: '3', name: 'Luis Rodríguez', campaign: 'Campaña de Reforestación' },
        // Puedes reemplazar esta lista con los datos de una API
    ]);

    useEffect(() => {
        // Aquí podrías hacer la llamada a la API si fuera necesario
        // Por ejemplo:
        // axios.get('tuAPI.com/usuarios')
        // .then(response => setUsuarios(response.data));
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.userContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.campaignName}>Participó en: {item.campaign}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial de Usuarios</Text>
            <FlatList
                data={usuarios}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
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
});
