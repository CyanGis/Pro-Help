import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Header } from 'react-native-elements';
import UserService from '../../../Kernel/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashBoard() {
    const [campaigns, setCampaigns] = useState([]);
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const getData = async () => {
        try {
           
            const value = await AsyncStorage.getItem('token');
            
            if (value !== null) {
                console.log("Token obtenido: ", value);
                const profile = await UserService.getYourProfile(value);
                if (profile) {
                    const existingProfile = await AsyncStorage.getItem('profile');
                    if (existingProfile !== JSON.stringify(profile)) {
                        await AsyncStorage.setItem("profile", JSON.stringify(profile));
                        console.log("Perfil actualizado:", profile);
                    } else {
                        console.log("El perfil ya está guardado y no se actualizó.");
                    }
                }
            } else {
                console.log("No se encontró el dato en AsyncStorage");
            }
        } catch (error) {
            console.error("Error al obtener el dato: ", error);
        }
    };
    useEffect(() => {
        getData();
    },[]);


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
