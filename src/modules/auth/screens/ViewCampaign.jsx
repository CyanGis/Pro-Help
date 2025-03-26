import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
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
    const { item } = route.params;
    const {
        nombre: titulo,
        descripcion,
        image: imagen,
        categoria,
        recursoTipo: recurso,
        direccion,
        fechaInicio,
        fechaFin,
        progreso
    } = item; // Desestructuración completa aquí

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>{titulo}</Text>
            </View>
            <View style={{ padding: 20 }}>
                <Image source={imagenes[imagen]} style={styles.image} />
                <Text style={styles.description}>Descripción: {descripcion}</Text>
                <Text style={styles.category}>Categoría: {categoria}</Text>
                <Text style={styles.resource}>Tipo: {recurso}</Text>
                <Text style={styles.address}>Dirección: {direccion ? direccion : 'No disponible'}</Text>
                <Text style={styles.date}>Fecha inicio: {fechaInicio ? fechaInicio : 'No disponible'}</Text>
                <Text style={styles.date}>Fecha fin: {fechaFin ? fechaFin : 'No disponible'}</Text>
                <Text style={styles.progress}>Progreso: {progreso ? progreso + '%' : 'No disponible'}</Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Suscribirse a la campaña</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Realizar donación</Text>
                </TouchableOpacity>
            </View>
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
});
