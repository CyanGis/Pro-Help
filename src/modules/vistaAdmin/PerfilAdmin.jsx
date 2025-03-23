import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Icon } from '@rneui/base';

export default function PerfilDonante() {
  const [modalEditar, setModalEditar] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);

  const [nombre, setNombre] = useState("Name");
  const [email, setEmail] = useState("email@example.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://i.pravatar.cc/150' }} style={styles.profilePic} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{nombre}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          <Text style={styles.userRole}>Donante</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={() => setModalEditar(true)}>
        <Icon name="account-edit" type="material-community" color="#fff" size={20} />
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => setModalPassword(true)}>
        <Icon name="lock-reset" type="material-community" color="#fff" size={20} />
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>
      
      {/* Modal para Editar Perfil */}
      <Modal visible={modalEditar} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre" />
            
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
      
      {/* Modal para Cambiar Contraseña */}
      <Modal visible={modalPassword} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
            <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} placeholder="Contraseña Actual" />
            <TextInput style={styles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} placeholder="Nueva Contraseña" />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={() => setModalPassword(false)}>
                <Text style={styles.saveButtonText}>Actualizar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalPassword(false)}>
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: 
  { flex: 1, 
    backgroundColor: "#f4f4f4", 
    padding: 20 
  },
  profileHeader: 
  { alignItems: "center", 
    marginTop: 30 
  },
  profilePic: { 
    width: 120, 
    height: 120, 
    borderRadius: 60,
    borderWidth: 3, 
    borderColor: "#896447" 
  },
  userInfo: { 
    alignItems: "center", 
    marginTop: 10 
  },
  userName: { 
    fontSize: 22, 
    fontWeight: "bold" 
  },
  userEmail: { 
    fontSize: 16, 
    color: "gray" 
  },
  userRole: { 
    fontSize: 14, 
    color: "#666", 
    marginTop: 5 
  },
  button: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#000", 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 15, 
    justifyContent: "center" 
  },
  buttonSecondary: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#000", 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 10, 
    justifyContent: "center" 
  },
  buttonText: { 
    color: "#fff", 
    marginLeft: 8, 
    fontWeight: "bold" 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: 
  { width: "80%", 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 10, 
    alignItems: "center" 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  input: { 
    width: "100%", 
    padding: 10, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8, 
    marginBottom: 10 
  },
  buttonRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "100%", 
    marginTop: 10 
  },
  saveButton: { 
    backgroundColor: "#000", 
    padding: 10, 
    borderRadius: 8, 
    flex: 1, 
    marginRight: 5, 
    alignItems: "center" 
  },
  saveButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  closeButton: { 
    backgroundColor: "#FF4B4B", 
    padding: 10, 
    borderRadius: 8, 
    flex: 1, 
    marginLeft: 5, 
    alignItems: "center" 
  },
  closeButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});
