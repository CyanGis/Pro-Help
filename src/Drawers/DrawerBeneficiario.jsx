import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from "react-native";
import { DrawerItemList } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons'; // Importa los iconos de Expo
import DashBoard from '../modules/auth/screens/DashBoard';
import Ubicaciones from '../modules/vistaAdmin/Ubicaciones';
import PerfilBeneficiario from '../VistaUsuario/PerfilBeneficiario';

const Drawer = createDrawerNavigator();

// Contenido personalizado del Drawer
function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      {/* Aquí se incluyen las pantallas del Drawer */}
      <DrawerItemList {...props} /> 

      {/* Opción de Cerrar Sesión */}
      <Text
        style={styles.logoutText}
        onPress={() => props.navigation.replace('Login')}
      >
        Cerrar Sesión
      </Text>
    </View>
  );
}

// Drawer principal con iconos personalizados
function DrawerBeneficiario(props) {
  return (
    <Drawer.Navigator
      initialRouteName="DashBoard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#AFCCD0',
          width: 250,
        },
        headerStyle: {
          backgroundColor: '#AFCCD0',
        },
        headerTintColor: '#000',
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
        component={PerfilBeneficiario} 
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
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

export default DrawerBeneficiario;

const styles = StyleSheet.create({
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
