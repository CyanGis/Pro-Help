import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from "react-native";
import { DrawerItemList } from '@react-navigation/drawer';
import DashBoard from '../modules/auth/screens/DashBoard';
import Ubicaciones from '../modules/vistaAdmin/Ubicaciones';
import PerfilUser from '../VistaUsuario/PerfilUser';
import Campaings from '../VistaUsuario/Campaings';

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
        onPress={() => props.navigation.replace('Login')} // Reemplaza "Login" con tu pantalla de login
      >
        Cerrar Sesión
      </Text>
    </View>
  );
}

// Drawer principal con las pantallas definidas
function DrawerUsuario(props) {
  return (
    <Drawer.Navigator
      initialRouteName="DashBoard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* Aquí se definen las pantallas que aparecerán en el Drawer */}
      <Drawer.Screen name="DashBoard" component={DashBoard} />
      <Drawer.Screen name="Perfil" component={PerfilUser} />
      <Drawer.Screen name="Ubicaciones" component={Ubicaciones} />
      <Drawer.Screen name="Campañas" component={Campaings} />
    </Drawer.Navigator>
  );
}

export default DrawerUsuario;

const styles = StyleSheet.create({
  logoutText: {
    marginTop: 20,
    padding: 15,
    color: "#FF4B4B",  // Cambié el color para que se vea más como una opción
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',  // Alinea el texto en el centro
    borderTopWidth: 1,
    borderTopColor: "#ddd",  // Para darle una línea de separación con las opciones anteriores
  },
});
