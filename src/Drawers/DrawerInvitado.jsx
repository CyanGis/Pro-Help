import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { StyleSheet, Text, View, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Importar iconos de Expo
import DashBoardInvitado from "../vistaInvitado/DashBoardInvitado";
import CreacteAccount from '../modules/auth/screens/CreacteAccount'
import DashBoard from "../modules/auth/screens/DashBoard";

const logoDrawer = require("../../assets/logoDrawer.png");
const Drawer = createDrawerNavigator();

// Contenido personalizado del Drawer con imagen y opciones
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* 🔹 Imagen de encabezado */}
      <View style={styles.drawerHeader}>
        <Image source={logoDrawer} style={styles.logo} />
      </View>

      {/* 🔹 Lista de opciones del Drawer */}
      <DrawerItemList {...props} />

      {/* 🔹 Opción de Cerrar Sesión */}
      <Text style={styles.logoutText} onPress={() => props.navigation.replace("Login")}>
        Cerrar Sesión
      </Text>
    </DrawerContentScrollView>
  );
}

// Drawer con imagen personalizada y opciones con íconos
export default function DrawerInvitado() {
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
      {/* Pantallas con iconos */}
      <Drawer.Screen
        name="DashBoard"
        component={DashBoardInvitado}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Crear Cuenta"
        component={CreacteAccount}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="person-add" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

// 🎨 **Estilos personalizados**
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
  },
  logoutText: {
    marginTop: 20,
    padding: 15,
    color: "#FF4B4B",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
