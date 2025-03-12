import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StyleSheet, Text, View } from "react-native";
import { DrawerItemList } from "@react-navigation/drawer";
import CreateAccount from "../modules/auth/screens/CreacteAccount";
import DashBoard from "../modules/auth/screens/DashBoard";

const Drawer = createDrawerNavigator();

// Custom Drawer Content para manejar "Cerrar sesión"
function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <DrawerItemList {...props} /> {/* Renderiza las pantallas definidas en Drawer.Navigator */}
      
      {/* Opción de Cerrar Sesión */}
      <Text
        style={styles.logoutText}
        onPress={() => props.navigation.replace('Login')} // Navegar a la pantalla de login
      >
        Salir
      </Text>
    </View>
  );
}

// Drawer para invitados (sin acceso al resto de pantallas)
export default function DrawerInvitado(props) {
  return (
    <Drawer.Navigator
      initialRouteName="DashBoard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* Definición de las pantallas en el Drawer */}
      <Drawer.Screen name="DashBoard" component={DashBoard} />
      <Drawer.Screen name="Crear Cuenta" component={CreateAccount} />
    </Drawer.Navigator>
  );
}

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
