import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ViewCampaign from "../../modules/auth/screens/ViewCampaign";

const Stack = createStackNavigator();

export default function ViewCampaignStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen name="" component={ViewCampaign} options={{title: 'Detalles de Campaña'}} />
        </Stack.Navigator>
    )
}