import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { StyleSheet, Text, View, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Importa los iconos de Expo
import DashBoard from "../modules/auth/screens/DashBoard";
import Ubicaciones from "../modules/vistaAdmin/Ubicaciones";
import PerfilAdmin from "../modules/vistaAdmin/PerfilAdmin";
import Usuarios from "../modules/vistaAdmin/Usuarios";
import CrearCampaings from "../modules/vistaAdmin/CrearCampaings";

// Importar la imagen del Drawer
const logoDrawer = require("../../assets/logoDrawer.png");

const Drawer = createDrawerNavigator();

// Contenido personalizado del Drawer con imagen y opciones
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Imagen de encabezado */}
      <View style={styles.drawerHeader}>
        <Image source={logoDrawer} style={styles.logo} />
      </View>

      {/* Lista de opciones del Drawer */}
      <DrawerItemList {...props} />

      {/* Opción de Cerrar Sesión */}
      <Text style={styles.logoutText} onPress={() => props.navigation.replace("Login")}>
        Cerrar Sesión
      </Text>
    </DrawerContentScrollView>
  );
}

// Drawer con imagen personalizada y iconos en las opciones
function DrawerNavigationAdmin() {
  return (
    <Drawer.Navigator
      initialRouteName="DashBoard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { backgroundColor: "#AFCCD0", width: 250 },
        headerStyle: { backgroundColor: "#AFCCD0" },
        headerTintColor: "#000",
      }}
    >
      {/* Pantallas con iconos */}
      <Drawer.Screen
        name="DashBoard"
        component={DashBoard}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={PerfilAdmin}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Crear Campañas"
        component={CrearCampaings}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="campaign" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Usuarios Registrados"
        component={Usuarios}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="group" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Ubicaciones"
        component={Ubicaciones}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="place" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigationAdmin;

// Estilos personalizados
const styles = StyleSheet.create({
  drawerHeader: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#AFCCD0",
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
