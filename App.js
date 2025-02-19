import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/modules/auth/screens/Login';
import CreateAccount from './src/modules/auth/screens/CreacteAccount';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createStackNavigator();

export default function App() {
    useEffect(() => {
        const prepare = async () => {
            try {
                // Mantén la splash screen visible mientras cargas recursos
                await SplashScreen.preventAutoHideAsync();
                // Carga cualquier recurso o dato necesario aquí
            } catch (e) {
                console.warn(e);
            } finally {
                // Oculta la splash screen después de 3 segundos o cuando hayas terminado de cargar recursos
                setTimeout(async () => {
                    await SplashScreen.hideAsync();
                }, 3000);
            }
        };

        prepare();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="CreateAccount" component={CreateAccount} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
