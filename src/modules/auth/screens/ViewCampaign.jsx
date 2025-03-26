import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ViewCampaign({ route }) {
    const { titulo, descripcion, imagen, categoria, recurso } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{titulo}</Text>
            <Image source={{ uri: imagen }} style={styles.image} />
            <Text style={styles.description}>{descripcion}</Text>
            <Text style={styles.category}>Categoría: {categoria}</Text>
            <Text style={styles.resource}>Recurso: {recurso}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold' },
    image: { width: '100%', height: 200, borderRadius: 10 },
    description: { marginTop: 10, fontSize: 16 },
    category: { marginTop: 5, color: 'gray' },
    resource: { marginTop: 5, color: 'blue' },
});
