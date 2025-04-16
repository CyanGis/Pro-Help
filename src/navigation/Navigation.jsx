import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../modules/auth/screens/Login';
import CreateAccount from '../modules/auth/screens/CreateAccount';
import DrawerNavigation from '../Drawers/DrawerNavigationAdmin';
import DrawerInvitado from '../Drawers/DrawerInvitado';
import DrawerDonante from '../Drawers/DrawerDonante';
import ViewCampaign from '../modules/auth/screens/ViewCampaign';
import ViewCampaignInvitado from "../vistaInvitado/ViewCampaignInvitado"

const Stack = createStackNavigator();

export default function Navigation({linking}) {
  return (
    <NavigationContainer linking={linking}>
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="DashBoard" component={DrawerNavigation} />
        <Stack.Screen name="DashBoardInvitado" component={DrawerInvitado} />
        <Stack.Screen name="DashBoardDonante" component={DrawerDonante} />
        <Stack.Screen name="ViewCampaign" component={ViewCampaign} />
        <Stack.Screen name="ViewCampaignInvitado" component={ViewCampaignInvitado} />
    </Stack.Navigator>
    </NavigationContainer>
  );
}
