import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Header } from 'react-native-elements';
import UserService from '../../../Kernel/Service';
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

const plantillas = [
    {
        nombre: "Moderna Azul",
        codigo: "001",
        categoria: "Moderna",
        componente: ({ titulo, descripcion, imagen, categoria, onToggleDescription, isExpanded }) => (
            <View style={styles.card}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{titulo}</Text>
                </View>
                {
                    imagen.length > 20 ?
                        <Image source={{ uri: imagen }} style={styles.image} /> :
                        <Image source={imagenes[imagen]} style={styles.image} />
                }
                <View style={styles.infoContainer}>
                    <Text style={styles.description}>
                        {isExpanded ? descripcion : descripcion.slice(0, 100) + '...'}
                    </Text>
                    {descripcion.length > 100 && (
                        <TouchableOpacity onPress={onToggleDescription}>
                            <Text style={styles.link}>{isExpanded ? 'Ver menos' : 'Ver más'}</Text>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.category}>{categoria}</Text>
                </View>
            </View>
        ),
    },
    {
        nombre: "Moderna Azul",
        codigo: "002",
        categoria: "Moderna",
        componente: ({ titulo, descripcion, imagen, categoria, onToggleDescription, isExpanded }) => (
            <View style={styles.cardAlt}>
                {
                    imagen.length > 40 ?
                        <Image source={{ uri: imagen }} style={styles.image} /> :
                        <Image source={imagenes[imagen]} style={styles.image} />
                }
                <View style={styles.infoContainer}>
                    <Text style={styles.titleAlt}>{titulo}</Text>
                    <Text style={styles.descriptionAlt}>
                        {isExpanded ? descripcion : descripcion.slice(0, 100) + '...'}
                    </Text>
                    {descripcion.length > 100 && (
                        <TouchableOpacity onPress={onToggleDescription}>
                            <Text style={styles.link}>{isExpanded ? 'Ver menos' : 'Ver más'}</Text>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.categoryAlt}>{categoria}</Text>
                </View>
            </View>
        ),
    },
];

export default function DashBoard() {
    const [campaigns, setCampaigns] = useState([]);
    const [expanded, setExpanded] = useState({});  // State to manage expanded descriptions
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                const profile = await UserService.getYourProfile(value);
                try {
                    const campaings = await UserService.getAllCampaigns(value);
                    setCampaigns(campaings);
                    console.log(campaings[0])
                } catch (error) {
                    console.error("Error al obtener campañas: ", error);
                }
            }
        } catch (error) {
            console.error("Error al obtener el dato: ", error);
        }
    };

    useEffect(() => {
        getData();
    }, [isFocused]);

    const handleToggleDescription = (id) => {
        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id],  // Toggle the expansion state of the description
        }));
    };

    const renderItem = ({ item }) => {
        const plantilla = plantillas.find(p => p.codigo === item.templateEntity?.codigo);
        if (plantilla) {
            return (
                <TouchableOpacity onPress={() =>
                    navigation.navigate('ViewCampaign', {item})
                }>
                    {plantilla.componente({
                        titulo: item.nombre,
                        descripcion: item.descripcion,
                        imagen: item.image,
                        categoria: item.categoria,
                        onToggleDescription: () => handleToggleDescription(item.id),
                        isExpanded: expanded[item.id] || false,
                    })}
                </TouchableOpacity>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            {campaigns.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../../../assets/empty.png')}
                        style={styles.emptyImage}
                    />
                </View>
            ) : (
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={campaigns}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7e7e7',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        margin: 30,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 200,
    },
    infoContainer: {
        padding: 20,
    },
    titleContainer: {
        padding: 10,
        backgroundColor: '#000000',
        borderRadius: 5,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
    },
    description: {
        fontSize: 18,
        marginTop: 5,
    },
    link: {
        color: 'blue',
        marginTop: 5,
        textDecorationLine: 'underline',
    },
    category: {
        fontSize: 12,
        marginTop: 5,
        color: 'gray',
    },
    cardAlt: {
        margin: 30,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    titleAlt: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    descriptionAlt: {
        fontSize: 18,
    },
    categoryAlt: {
        fontSize: 12,
        color: 'gray',
    },
});
