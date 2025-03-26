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
        componente: ({ titulo, descripcion, imagen, categoria }) => (
            <View style={styles.card}>

                {
                    imagen.length > 20 ?
                        <Image source={{ uri: imagen }} style={styles.image} /> :
                        <Image source={imagenes[imagen]} style={styles.image} />
                }
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{titulo}</Text>
                    <Text style={styles.description}>{descripcion}</Text>
                    <Text style={styles.category}>{categoria}</Text>
                </View>
            </View>
        ),
    },
    {
        nombre: "Moderna Azul",
        codigo: "002",
        categoria: "Moderna",
        componente: ({ titulo, descripcion, imagen, categoria }) => (
            <View style={styles.cardAlt}>
                {
                    imagen.length > 40 ?
                        <Image source={{ uri: imagen }} style={styles.image} /> :
                        <Image source={imagenes[imagen]} style={styles.image} />
                }
                <Text style={styles.titleAlt}>{titulo}</Text>
                <Text style={styles.descriptionAlt}>{descripcion}</Text>
                <Text style={styles.categoryAlt}>{categoria}</Text>
            </View>
        ),
    },
];

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
                try {
                    const campaings = await UserService.getAllCampaigns(value);
                    //console.log("Campañas obtenidas: ", campaings[0]);
                    setCampaigns(campaings);
                } catch (error) {
                    console.error("Error al obtener campañas: ", error);
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
    }, [isFocused]);

    const renderItem = ({ item }) => {
        const plantilla = plantillas.find(p => p.codigo === item.templateEntity?.codigo);

        if (plantilla) {
            return (
                <TouchableOpacity onPress={() =>
                    navigation.navigate('ViewCampaign', {
                        titulo: item.nombre,
                        descripcion: item.descripcion,
                        imagen: item.image,
                        categoria: item.categoria,
                        recurso: item.recursoTipo
                    })
                }>
                    {plantilla.componente({
                        titulo: item.nombre,
                        descripcion: item.descripcion,
                        imagen: item.image,
                        categoria: item.categoria
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
        backgroundColor: '#ffffff',
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    infoContainer: {
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        marginTop: 5,
    },
    category: {
        fontSize: 12,
        marginTop: 5,
        color: 'gray',
    },
    cardAlt: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    titleAlt: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    descriptionAlt: {
        fontSize: 14,
    },
    categoryAlt: {
        fontSize: 12,
        color: 'gray',
    },
    emptyImage: {
        width: 300, 
        height: 300, 
        marginBottom: 20,
      },
});
