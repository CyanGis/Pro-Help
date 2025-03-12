import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from "react-native";
import { DrawerItemList } from '@react-navigation/drawer';
import DashBoard from '../modules/auth/screens/DashBoard';
import Ubicaciones from '../modules/vistaAdmin/Ubicaciones';
import PerfilAdmin from '../modules/vistaAdmin/PerfilAdmin';
import Usuarios from '../modules/vistaAdmin/Usuarios';
import CrearCampaings from '../modules/vistaAdmin/CrearCampaings';

const Drawer = createDrawerNavigator();

// Contenido personalizado del Drawer
function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      {/* Aquí se incluyen las pantallas del Drawer */}
      <DrawerItemList {...props} /> {/* Renderiza las pantallas definidas en Drawer.Navigator */}

      {/* Opción de Cerrar Sesión */}
      <Text
        style={styles.logoutText}
        onPress={() => props.navigation.replace("Login")} // Reemplaza "Login" con tu pantalla de login
      >
        Cerrar Sesión
      </Text>
    </View>
  );
}

// Drawer principal con las pantallas definidas
function DrawerNavigationAdmin(props) {
  return (
    <Drawer.Navigator
      initialRouteName="DashBoard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* Aquí se definen las pantallas que aparecerán en el Drawer */}
      <Drawer.Screen name="DashBoard" component={DashBoard} />
      <Drawer.Screen name="Perfil" component={PerfilAdmin} />
      <Drawer.Screen name="Crear Campañas" component={CrearCampaings} />
      <Drawer.Screen name="Usuarios" component={Usuarios} />
      <Drawer.Screen name="Ubicaciones" component={Ubicaciones} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigationAdmin;

const styles = StyleSheet.create({
  logoutText: {
    marginTop: 20,
    padding: 15,
    color: "#FF4B4B", // Color del texto para destacarlo
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center", // Alinea el texto en el centro
    borderTopWidth: 1,
    borderTopColor: "#ddd", // Para darle una línea de separación con las opciones anteriores
  },
});
