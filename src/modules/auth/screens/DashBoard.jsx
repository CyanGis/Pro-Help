// src/modules/dashboard/screens/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export default function Dashboard() {
    const [campaigns, setCampaigns] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        // Aquí se hace la petición a la API para obtener las campañas
        fetch('https://tuapi.com/campaigns')
            .then((response) => response.json())
            .then((data) => setCampaigns(data))
            .catch((error) => console.error(error));
    }, [isFocused]);

    const renderCampaign = ({ item }) => (
        <View style={styles.campaign}>
            <Text style={styles.campaignTitle}>{item.title}</Text>
            <Text style={styles.campaignDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {campaigns.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../../../assets/empty.png')} // Marca de agua cuando no hay campañas
                        style={styles.watermarkImage}
                    />
                </View>
            ) : (
                <FlatList
                    data={campaigns}
                    renderItem={renderCampaign}
                    keyExtractor={(item) => item.id}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    watermarkImage: {
        width: '80%',
        height: '80%',
        opacity: 0.2 // Marca de agua transparente
    },
    campaign: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD'
    },
    campaignTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    campaignDescription: {
        fontSize: 14,
        marginTop: 4
    }
});
