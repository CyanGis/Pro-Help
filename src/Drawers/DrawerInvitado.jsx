import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { StyleSheet, Text, View, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Importar iconos de Expo
import DashBoard from "../modules/auth/screens/DashBoard";
import CreateAccount from "../modules/auth/screens/CreacteAccount";

const Drawer = createDrawerNavigator();

// Contenido personalizado del Drawer con imagen y opciones
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Imagen de encabezado */}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image source={require("../../assets/logoDrawer.png")} style={styles.logo} />
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
export default function DrawerInvitado() {
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
        name="Crear Cuenta"
        component={CreateAccount}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="person-add" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

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
    width: 200, // Tamaño de la imagen
    height: 100,
    justifyContent: "center",
    alignItems:"center",
    resizeMode: "contain", // Para que no se deforme
    marginBottom: 20,
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
