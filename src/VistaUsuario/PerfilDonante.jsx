import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Icon } from '@rneui/base';

export default function PerfilDonante() {
  const [modalHistorial, setModalHistorial] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  // Estado para editar los datos del perfil
  const [nombre, setNombre] = useState("Name Donante");

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 Foto de Perfil */}
      <View style={styles.profilePicContainer}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150' }} 
          style={styles.profilePic}
        />
      </View>

      {/* 🔹 Nombre y Rol */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{nombre}</Text>
        <Text style={styles.userRole}>Donante</Text>
      </View>

      {/* 🔹 Botón de Editar Perfil */}
      <TouchableOpacity style={styles.editProfileButton} onPress={() => setModalEditar(true)}>
        <Icon name="pencil" type="material-community" color="#fff" size={20} />
        <Text style={styles.editProfileText}>Editar Perfil</Text>
      </TouchableOpacity>

      {/* 🔹 Botón de Historial de Donaciones */}
      <TouchableOpacity style={styles.historyButton} onPress={() => setModalHistorial(true)}>
        <Text style={styles.historyText}>Ver Historial de Campañas</Text>
      </TouchableOpacity>

      {/* 🔹 Modal de Historial de Campañas */}
      <Modal visible={modalHistorial} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Historial de Campañas</Text>
            
            <View style={styles.donationItem}>
              <Icon name="heart" type="material-community" color="red" size={16} />
              <Text style={styles.donationText}>Campaña: "Alimentos para Todos"</Text>
            </View>
            <View style={styles.donationItem}>
              <Icon name="heart" type="material-community" color="red" size={16} />
              <Text style={styles.donationText}>Campaña: "Ayuda Escolar"</Text>
            </View>
            <View style={styles.donationItem}>
              <Icon name="heart" type="material-community" color="red" size={16} />
              <Text style={styles.donationText}>Campaña: "Salud y Bienestar"</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalHistorial(false)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🔹 Modal de Edición de Perfil */}
      <Modal visible={modalEditar} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <TextInput 
              style={styles.input} 
              value={nombre} 
              onChangeText={setNombre} 
              placeholder="Nombre" 
            />

            {/* 🔹 Botones en la misma línea */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={() => setModalEditar(false)}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => setModalEditar(false)}>
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// 🎨 **Estilos**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  profilePicContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  userInfo: {
    alignItems: "center",
    marginTop: 10,
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
  historyButton: {
    backgroundColor: "#AFCCD0",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 15,
    alignItems: "center",
  },
  historyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",  // Alinea los botones en la misma fila
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#1877f2",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#FF4B4B",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  donationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    padding: 8,
    borderRadius: 8,
  },
  donationText: {
    fontSize: 14,
    marginLeft: 5,
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

