import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StyleSheet, Text, View, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; // Importa los iconos de Expo
import DashBoard from '../modules/auth/screens/DashBoard';
import Ubicaciones from '../modules/vistaAdmin/Ubicaciones';
import PerfilDonante from '../VistaUsuario/PerfilDonante';
import ChatUsuario from '../VistaUsuario/ChatUsuario';

const Drawer = createDrawerNavigator();

// Contenido personalizado del Drawer
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Imagen de encabezado */}
      <View style={styles.drawerHeader}>
        <Image source={require("../../assets/logoDrawer.png")} style={styles.logo} />
      </View>
      
      {/* Lista de opciones del Drawer */}
      <DrawerItemList {...props} />
      
      {/* Opción de Cerrar Sesión */}
      <Text style={styles.logoutText} onPress={() => props.navigation.replace('Login')}>
        Cerrar Sesión
      </Text>
    </DrawerContentScrollView>
  );
}

// Drawer principal con iconos personalizados
function DrawerDonante(props) {
  return (
    <Drawer.Navigator
      initialRouteName="DashBoard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { backgroundColor: "#FFDCCE", width: 250 },
        headerStyle: { backgroundColor: "#896447" },
        headerTintColor: "#FFDCCE",
        drawerActiveTintColor: "#000", // Cambia el color del texto seleccionado a negro
        drawerInactiveTintColor: "#444", // Color del texto no seleccionado
        drawerActiveBackgroundColor: "#fff", // Evita el fondo azul en el seleccionado
      }}
    >
      {/* Pantallas del Drawer con Iconos */}
      <Drawer.Screen 
        name="DashBoard" 
        component={DashBoard} 
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Perfil" 
        component={PerfilDonante} 
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={ChatUsuario}
        options={{
            drawerIcon: ({ color, size }) => <MaterialIcons name="chat" size={size} color={color} />,
          }}
      />
      <Drawer.Screen 
        name="Ubicaciones" 
        component={Ubicaciones} 
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="place" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerDonante;

const styles = StyleSheet.create({
  drawerHeader: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFDCCE",
    padding: 20,
  },
  logo: {
    width: 150, // Tamaño de la imagen
    height: 100,
    resizeMode: "contain", // Para que no se deforme
    marginBottom: 20,
  },
  logoutText: {
    marginTop: 20,
    padding: 15,
    color: "#FF4B4B",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});