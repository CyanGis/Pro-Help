import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Header } from 'react-native-elements';

export default function DashBoard() {
    const [campaigns, setCampaigns] = useState([]);
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text>Este es el DashBoard Global</Text>
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
    header: {
        backgroundColor: '#AFCCD0', // Color de fondo para todo el Header
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
