import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Icon } from '@rneui/base';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from '../Kernel/Service';

export default function PerfilDonante() {
  const [modalEditar, setModalEditar] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [sexo, setSexo] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("");

  const isFocused = useIsFocused();

  const getData = async () => {
    try {
      console.log("Iniciando getData...");
      const value = await AsyncStorage.getItem('token');
      console.log("Token obtenido:", value);
      
      if (value !== null) {
        console.log("Llamando a UserService.getYourProfile...");
        const profile = await UserService.getYourProfile(value);
        console.log("Respuesta completa de la API:", JSON.stringify(profile, null, 2));
  
        if (profile && profile.user) {
          console.log("Datos del usuario recibidos:", {
            name: profile.user.name,
            lastName: profile.user.lastName,
            email: profile.user.email,
            phone: profile.user.phone,
            direccion: profile.user.direccion,
            sexo: profile.user.sexo,
            role: profile.user.role
          });
  
          setNombre(profile.user.name || "");
          setApellido(profile.user.lastName || "");
          setEmail(profile.user.email || "");
          setTelefono(profile.user.phone || "");
          setDireccion(profile.user.direccion || "");
          setSexo(profile.user.sexo || "");
          setRole(profile.user.role || "");
  
          await AsyncStorage.setItem("profile", JSON.stringify(profile));
          console.log("Datos guardados en estado y AsyncStorage");
        } else {
          console.log("El perfil o user es null/undefined");
        }
      } else {
        console.log("No se encontró token en AsyncStorage");
      }
    } catch (error) {
      console.error("Error en getData:", error);
    }
  };


  useEffect(() => {
    getData();
  }, [isFocused]);

    const handleUpdateProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedProfile = await AsyncStorage.getItem("profile");
        const parsedProfile = JSON.parse(storedProfile);
        const userId = parsedProfile.user.id; // o profile.id dependiendo del formato
    
        const updatedUser = {
          name: nombre,
          lastName: apellido,
          email: email,
          phone: telefono,
          direccion: direccion,
          sexo: sexo,
          role: role, // lo puedes mantener igual
          password: "" // para que no se actualice
        };
    
        const response = await UserService.updateUser(userId, updatedUser, token);
        console.log("Respuesta del backend:", response);
        setModalEditar(false);
        await getData(); // refresca los datos del perfil
      } catch (error) {
        console.error("Error al actualizar el perfil:", error);
      }
    };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://i.pravatar.cc/150' }} style={styles.profilePic} />
        <Text style={styles.userName}>{nombre} {apellido}</Text>
        <Text style={styles.userRole}>{role === "USER" ? "USER" : "Administrador"}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoSection}>
          <Icon name="email" type="material-community" color="#896447" size={20} />
          <Text style={styles.infoText}>{email}</Text>
        </View>

        <View style={styles.infoSection}>
          <Icon name="phone" type="material-community" color="#896447" size={20} />
          <Text style={styles.infoText}>{telefono || "No especificado"}</Text>
        </View>

        <View style={styles.infoSection}>
          <Icon name="map-marker" type="material-community" color="#896447" size={20} />
          <Text style={styles.infoText}>{direccion || "No especificada"}</Text>
        </View>

        <View style={styles.infoSection}>
          <Icon name="gender-male-female" type="material-community" color="#896447" size={20} />
          <Text style={styles.infoText}>
            {sexo === "H" ? "Hombre" : sexo === "M" ? "Mujer" : "No especificado"}
          </Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => setModalEditar(true)}
        >
          <Icon name="account-edit" type="material-community" color="#fff" size={20} />
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.passwordButton]}
          onPress={() => setModalPassword(true)}
        >
          <Icon name="lock-reset" type="material-community" color="#fff" size={20} />
          <Text style={styles.buttonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para Editar Perfil */}
      <Modal visible={modalEditar} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <View style={styles.nameRow}>
              <TextInput
                style={[styles.input, styles.nameInput]}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre"
              />
              <TextInput
                style={[styles.input, styles.nameInput]}
                value={apellido}
                onChangeText={setApellido}
                placeholder="Apellido"
              />
            </View>

            {/* <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            /> */}
            <TextInput
              style={styles.input}
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Teléfono"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Dirección"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalEditar(false)}>
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
                <Text style={styles.saveButtonText}>Guardar</Text>
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
            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña Actual"
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nueva Contraseña"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalPassword(false)}>
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={() => setModalPassword(false)}>
                <Text style={styles.saveButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#896447",
    marginBottom: 15
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5
  },
  userRole: {
    fontSize: 16,
    color: "#896447",
    fontWeight: "500"
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
    flex: 1
  },
  buttonsContainer: {
    marginBottom: 30
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  editButton: {
    backgroundColor: "#896447",
  },
  passwordButton: {
    backgroundColor: "#333",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333"
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15
  },
  nameInput: {
    width: "48%"
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9"
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10
  },
  saveButton: {
    backgroundColor: "#896447",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center"
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center"
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
});