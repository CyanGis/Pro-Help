import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../modules/auth/screens/Login';
import CreateAccount from '../modules/auth/screens/CreacteAccount';
import DrawerNavigation from '../Drawers/DrawerNavigationAdmin';
import ForgotPassword from '../modules/auth/screens/ForgotPassword';
import ResetPassword from '../modules/auth/screens/ResetPassword';
import DrawerInvitado from '../Drawers/DrawerInvitado';
import DrawerDonante from '../Drawers/DrawerDonante';
import DrawerBeneficiario from '../Drawers/DrawerBeneficiario';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="DashBoard" component={DrawerNavigation} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="DashBoardInvitado" component={DrawerInvitado} />
        <Stack.Screen name="DashBoardDonante" component={DrawerDonante} />
        <Stack.Screen name="DashBoardBeneficiario" component={DrawerBeneficiario}/>
    </Stack.Navigator>
    </NavigationContainer>
  );
}
