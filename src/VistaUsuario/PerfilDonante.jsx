import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from '@rneui/base';

export default function PerfilDonante() {
  return (
    <ScrollView style={styles.container}>
      {/* 🔹 Imagen de Portada con Contorno */}
      <View style={styles.coverContainer}>
        <Image 
          source={{ uri: 'https://placehold.co/600x200/png' }} 
          style={styles.coverImage}
        />
      </View>

      {/* 🔹 Foto de Perfil con Contorno */}
      <View style={styles.profilePicContainer}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150' }} 
          style={styles.profilePic}
        />
      </View>

      {/* 🔹 Nombre y Rol */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>Name Donante</Text>
        <Text style={styles.userRole}>Donante</Text>
      </View>

      {/* 🔹 Botón de Editar Perfil */}
      <TouchableOpacity style={styles.editProfileButton}>
        <Icon name="pencil" type="material-community" color="#fff" size={20} />
        <Text style={styles.editProfileText}>Editar Perfil</Text>
      </TouchableOpacity>

      {/* 🔹 Información de Donaciones */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Donaciones</Text>
        <Text style={styles.infoText}><Icon name="hand-heart" type="material-community" size={16} /> Donaciones Realizadas: 15</Text>
        <Text style={styles.infoText}><Icon name="cash-multiple" type="material-community" size={16} /> Total Donado: $5,000 MXN</Text>
        <Text style={styles.infoText}><Icon name="account-heart" type="material-community" size={16} /> Beneficiarios Ayudados: 8</Text>
      </View>

      {/* 🔹 Historial de Donaciones con Contorno */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Historial de Donaciones</Text>
        <View style={styles.donationItem}>
          <Icon name="heart" type="material-community" color="red" size={16} />
          <Text style={styles.donationText}>$500 MXN - Fundación Niños Felices</Text>
        </View>
        <View style={styles.donationItem}>
          <Icon name="heart" type="material-community" color="red" size={16} />
          <Text style={styles.donationText}>$1,000 MXN - Comida para Todos</Text>
        </View>
        <View style={styles.donationItem}>
          <Icon name="heart" type="material-community" color="red" size={16} />
          <Text style={styles.donationText}>$200 MXN - Apoyo Escolar</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// 🎨 **Estilos con Contornos Grises**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  coverContainer: {
    width: "100%",
    height: 200,
    borderWidth: 2,  // Contorno gris en la imagen de portada
    borderColor: "#ccc",
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  profilePicContainer: {
    position: "absolute",
    top: 140,
    left: "50%",
    transform: [{ translateX: -50 }],
    borderWidth: 2,  // Contorno gris en la imagen de perfil
    borderColor: "#ccc",
    borderRadius: 100,
    backgroundColor: "#fff",
    padding: 4,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    alignItems: "center",
    marginTop: 50,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  userRole: {
    fontSize: 14,
    color: "gray",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1877f2",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  editProfileText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 2,  // Contorno gris en las tarjetas
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Sombra en Android
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "gray",
    marginTop: 2,
  },
  donationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    borderWidth: 2, // Contorno gris en cada donación
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
  },
  donationText: {
    fontSize: 14,
    marginLeft: 5,
    color: "gray",
  },
});
